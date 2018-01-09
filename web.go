package main

import (
	"bytes"
	"encoding/json"
	"flag"
	"fmt"
	"html/template"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strings"
)

func main() {
	flag.Parse()

	clientID := os.Getenv("GITHUB_APPLICATION_CLIENT_ID")
	clientSecret := os.Getenv("GITHUB_APPLICATION_CLIENT_SECRET")

	fmt.Printf("GITHUB_APPLICATION_CLIENT_ID => %s\n", clientID)
	fmt.Printf("len(GITHUB_APPLICATION_CLIENT_SECRET) => %d\n", len(clientSecret))

	mux := http.NewServeMux()
	dir := http.Dir("./generated")
	files := http.FileServer(dir)

	mux.Handle("/", cook(files, clientID))

	mux.HandleFunc("/github_callback", githubCallback)

	// We want to handle /authenticate/code
	mux.HandleFunc("/authenticate/", makeExchange(clientID, clientSecret))

	mux.HandleFunc("/search", search)

	server := &http.Server{
		Addr:    "0.0.0.0:8080",
		Handler: mux,
	}

	server.ListenAndServe()
}

/**
 * Chain Handler(s) in order to set the cookie required to authenticate with GitHub.
 */
func cook(h http.Handler, value string) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		cookie := http.Cookie{
			Name:  "stemcstudio-github-application-client-id",
			Value: value,
		}
		http.SetCookie(w, &cookie)
		h.ServeHTTP(w, r)
	})
}

/**
 * Handler function for the redirect from GitHub.
 */
func githubCallback(w http.ResponseWriter, r *http.Request) {
	files := []string{"templates/github_callback.html"}
	templates := template.Must(template.ParseFiles(files...))
	templates.ExecuteTemplate(w, "githubCallback", "")
}

type exchangePayload struct {
	ClientID     string `json:"client_id"`
	ClientSecret string `json:"client_secret"`
	Code         string `json:"code"`
}

type wrapToken struct {
	Token string `json:"token"`
}

type queryPayload struct {
	Query string `json:"query"`
}

/**
 * Handler function allowing the front-end application to exchange a temporary authorization code for a token.
 * The request comes through the server to avoid exposing the GitHub secret key.
 */
func makeExchange(clientID string, clientSecret string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// We need to return an HTML file that scrapes the code and state on the client application.
		path := r.URL.Path
		parts := strings.Split(path, "/")
		code := ""
		if len(parts) > 2 {
			code = parts[2]
		}
		// We now need to make a call to GitHub to exchange the code for a token.
		// TODO: Get all the parameters from the environment.
		data := exchangePayload{ClientID: clientID, ClientSecret: clientSecret, Code: code}
		jsonBytes, err := json.Marshal(data)
		if err != nil {
			log.Fatalf("JSON marshalling failed: %s", err)
		}
		resp, err := http.Post("https://github.com/login/oauth/access_token", "application/json", bytes.NewBuffer(jsonBytes))
		body, _ := ioutil.ReadAll(resp.Body)
		entries := strings.Split(string(body), "&")
		entry := entries[0]
		keyValue := strings.Split(entry, "=")
		token := keyValue[1]
		json.NewEncoder(w).Encode(&wrapToken{Token: token})
		// { "token": token } : { "error": "bad_code" }
	}
}

/**
 * Handle POST "/search" with body {query: "..."}
 */
func search(w http.ResponseWriter, r *http.Request) {
	var payload queryPayload
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&payload)
	if err != nil {
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}
	// The search string is now in payload.Query.
	fmt.Println("search..." + payload.Query)
}
