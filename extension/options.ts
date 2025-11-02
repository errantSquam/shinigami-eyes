var browser: Browser = browser || chrome;

browser.storage.local.get(['theme'], obj => {

    var theme: string = obj.theme || 'green-red';
    var themeSettingsContainer = document.getElementById('theme-settings');

    [
        'green-red',
        'purple-yellow',
        'cyan-orange',
    ].map(x => {
        themeSettingsContainer.insertAdjacentHTML('beforeend', `
        <label class="shinigami-eyes-theme shinigami-eyes-theme-${x}">
        <input type="radio" name="selected-theme" ${x == theme ? 'checked' : ''} data-theme="${x}">
        <span class="assigned-label-t-friendly">T-Friendly</span>,
        <span class="assigned-label-transphobic">Anti-trans</span>,
        <span class="assigned-label-unknown" title="Using Facebook as an example for unknown links.">Unknown (fb)</span>
        </label>
        `);
    });

});


browser.storage.local.get(['tooltip'], obj => {
    console.log(obj.tooltip)

    var tooltipOption: string = obj.tooltip || 'disabled';
    var tooltipOptionContainer = document.getElementById('tooltip-settings');

    [
        'enabled', 
        'disabled'
    ].map(x => {
        tooltipOptionContainer.insertAdjacentHTML('beforeend', `
        <label class="shinigami-eyes-tooltip shinigami-eyes-tooltip-${x}">
        <input type="radio" name="selected-tooltip" ${x == tooltipOption ? 'checked' : ''} data-tooltip="${x}">
        ${
        x === 'enabled' ? 
        `<span class="tooltip tooltip-t-friendly"}>${x}
            <span class ="tooltip-text">This person is <b>trans-friendly!</b></span>
        </span>
        `:

        `<span class=${x==='enabled'? "assigned-label-t-friendly" : "assigned-label-transphobic"}>${x}</span>`

        }
        </label>
        `);
    });

});

document.getElementById('save-button').addEventListener('click', async () => {
    var theme = (<HTMLInputElement>
        [...document.querySelectorAll('.shinigami-eyes-theme input')]
            .filter(x => (<HTMLInputElement>x).checked)[0]
    ).dataset.theme;
    var tooltip = (<HTMLInputElement>
        [...document.querySelectorAll('.shinigami-eyes-tooltip input')]
            .filter(x => (<HTMLInputElement>x).checked)[0]
    ).dataset.tooltip;
    console.log(tooltip)
    browser.storage.local.get(['theme', 'tooltip'], obj => {console.log(obj)})
    browser.runtime.sendMessage(<ShinigamiEyesCommand>{ closeCallingTab: true, setTheme: theme, setTooltip: tooltip }, () => { });
});


document.getElementById('cancel-button').addEventListener('click', async () => {
    browser.runtime.sendMessage(<ShinigamiEyesCommand>{ closeCallingTab: true }, () => { });
});
