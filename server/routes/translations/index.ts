import * as express from 'express';
const Translate = require('@google-cloud/translate');


// Your Google Cloud Platform project ID
const projectId = 'YOUR_PROJECT_ID';

// Instantiates a client
const translateClient = Translate({
    projectId: projectId
});

export function getTranslation(request: express.Request, response: express.Response): void {
    const params = request.params;
    console.log(`getTranslation(${JSON.stringify(params, null, 2)})`);
    const text: string = params.input;
    translateClient.translate(text, 'de')
        .then((results: string[]) => {
            const translation = results[0];

            console.log(`Text: ${text}`);
            console.log(`Translation: ${translation}`);
            response.status(200).send({ translation });
        });
}
