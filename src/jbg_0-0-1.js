// ==UserScript==
// @name         Jira Branchname Getter
// @namespace    https://jira.youkon-agency.com/
// @version      0.1
// @description  tampermonkey userscript to display a button in jira which creates a valid git branchname and copies it to the clipboard
// @author       Lorenz Kirnbauer
// @match        https://jira.youkon-agency.com/browse/CNNKN-*
// ==/UserScript==
(function() {
    'use strict';

    const copyToClipboard = str => {
        const el = document.createElement('textarea');
        el.value = str;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        const selected =
              document.getSelection().rangeCount > 0
        ? document.getSelection().getRangeAt(0)
        : false;
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        if (selected) {
            document.getSelection().removeAllRanges();
            document.getSelection().addRange(selected);
        }
    };

    function insertButton() {
        if (!document.getElementById('type-val') || !document.getElementById('key-val') || !document.getElementById('summary-val')) {
            return;
        }

        const bugType = document.getElementById('type-val').textContent.includes('Bug');

        const type = bugType ? 'bugfix' : 'feature';

        const key = document.getElementById('key-val').textContent;

        const summary = document.getElementById('summary-val').textContent;

        let cleanedSummary = summary.replace(/[\W_]+/g,"-");

        cleanedSummary = cleanedSummary.replace(/[-]+/g, '-');

        const gitString = `${type}/${key}-${cleanedSummary}`;

        const buttonText = 'copy as Branchname';

        const backgroundColor = '#27aa8e';

        const backgroundColorActive = '#238569';


        // creating the element
        const div = document.createElement('button');

        const content = document.createTextNode("copy Branchname");

        div.style.background = backgroundColor;
        div.style.color = "#fff";
        div.style.textAlign ='center';
        div.style.lineHeight ='24px';
        div.style.padding ='2px 6px';
        div.style.fontFamily ='Arial,Verdana';
        div.style.fontSize = '14px';
        div.style.borderRadius = '5px';
        div.style.cursor = 'pointer';

        div.innerText = buttonText;

        div.addEventListener('click', () => {
            copyToClipboard(gitString);

            div.innerText = 'copied to Clipboard';

            div.style.background = backgroundColorActive;

            setTimeout(() => {
                div.innerText = buttonText;
                div.style.background = backgroundColor;
            }, 1000);
        });

        document.querySelector('.content .aui-page-header-main').appendChild(div);
    }

    // insert button once on pageload - then leave it to the observer
    insertButton();

    const observedElement = document.querySelector('title');

    const observer = new MutationObserver(insertButton);

    const observerOptions = {
        subtree: true,
        characterData: true,
        childList: true
    };

    observer.observe(observedElement, observerOptions);
})();
