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
    var tooltipOption: string = obj.tooltip || 'disabled';
    var tooltipOptionContainer = document.getElementById('tooltip-settings');



    [ 
        'enabled',
        'disabled'
    ].map(x => {
        tooltipOptionContainer.insertAdjacentHTML('beforeend', `
        <label class="shinigami-eyes-tooltip shinigami-eyes-tooltip-${x}">
        <input type="radio" name="selected-tooltip" ${x == tooltipOption ? 'checked' : ''} data-tooltip="${x}">
        ${x === 'enabled' ? 
            `<span id = "enabled" class = 'tooltip-t-friendly'>Enabled</span>`
        :

                `<span class="assigned-label-transphobic">Disabled</span>`

            }
        </label>
        `);
    });

    let a = document.getElementById('enabled');
    a.classList.add('tooltip');

    let tooltipData = document.createElement('span');
    tooltipData.classList.add('tooltip-text');
    tooltipData.setAttribute('popover', '');
    tooltipData.innerHTML = `   Marked as <u>trans-friendly.</u>   `;

    a.appendChild(tooltipData);
    a.addEventListener("mouseover", () => {
        let dimensions = a.getBoundingClientRect();
        let yOffset = dimensions.height
        tooltipData.style.left = dimensions.x + dimensions.width / 2 + 'px'
        tooltipData.style.top = (dimensions.y - yOffset) + 'px'
        tooltipData.showPopover();
    });
    a.addEventListener("mouseout", () => { tooltipData.hidePopover() });

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
    browser.storage.local.get(['theme', 'tooltip'], obj => { console.log(obj) })
    browser.runtime.sendMessage(<ShinigamiEyesCommand>{ closeCallingTab: true, setTheme: theme, setTooltip: tooltip }, () => { });
});


document.getElementById('cancel-button').addEventListener('click', async () => {
    browser.runtime.sendMessage(<ShinigamiEyesCommand>{ closeCallingTab: true }, () => { });
});
