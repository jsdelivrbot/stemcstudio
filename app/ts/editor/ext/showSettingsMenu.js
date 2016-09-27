function showSettingsMenu(editor) {
    // make sure the menu isn't open already.
    var sm = document.getElementById('ace_settingsmenu');
    if (!sm)    
        overlayPage(editor, generateSettingsMenu(editor), '0', '0', '0');
}
