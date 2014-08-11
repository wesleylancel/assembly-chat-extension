(function () {
    var AssemblyChatExtension = function () {};

    // inject an extra menu item in Assembly's top menu to load this extension
    AssemblyChatExtension.prototype.injectMenuItem = function () {
        document.querySelector('ul.nav.navbar-nav').innerHTML += '<li><a href="#chat" id="chat-extension-load">Chat</a></li>';

        document.querySelector('#chat-extension-load').addEventListener('click', function () {
            window.chatExtension.load();
        });
    };

    // opens up the extension
    AssemblyChatExtension.prototype.load = function () {
        // make sure the page doesnt scroll
        document.body.style.overflow = 'hidden';

        // inject the main extension element
        document.body.innerHTML += '<div id="chat-extension" style="position: absolute; top: 0; left: 0; background-color: white; z-index: 9999; width: 100%; height: 100%;">';
    
        // inject menu
        window.chatExtension.injectChatMenu();
    };

    // inject the top menu into the extension element
    AssemblyChatExtension.prototype.injectChatMenu = function () {
        // load users chats
        var chats = document.querySelectorAll('a.list-group-item[href$="/chat"]');

        var chatMenu = '';
        var firstChat = false;

        [].forEach.call(chats, function (chat) {
            var parts = chat.getAttribute('href').split('/');
            var name = parts[1];

            if (!firstChat)
                firstChat = name;

            chatMenu += '<button data-chat-extension="' + name + '">' + name + '</button>';
        });

        // inject the menu
        document.querySelector('#chat-extension').innerHTML += '<div id="chat-extension-menu">' + chatMenu + '</div>';

        // add event handler to menu items
        document.addEventListener('click', function (e) {
            if (e.target.hasAttribute('data-chat-extension')) {
                window.chatExtension.showChat(e.target.getAttribute('data-chat-extension'));
            }
        });

        // load first chat
        window.chatExtension.injectChatFrame(firstChat);
    };

    // load an iframe containing the supplied chat
    AssemblyChatExtension.prototype.injectChatFrame = function (chat) {
        // add the iframe to the chat extension element
        var el = document.createElement('div');
        el.innerHTML = '<iframe class="chat-frame current-chat" id="chat-' + chat + '" src="/' + chat + '/chat" style="border: none; position: absolute; top: 50px; left:0; width: 100%; height: calc(100% - 50px);"></iframe>';

        document.querySelector('#chat-extension').appendChild(el);
    
        // add CSS after 5 seconds
        setTimeout(function () { window.chatExtension.injectCustomCSS(chat); }, 5000);
    };

    AssemblyChatExtension.prototype.injectCustomCSS = function (chat) {
        // the css to inject
        var injectCSS = '.navbar {     display: none !important; }  .col-md-2.col-md-pull-10.fixed-enabler {     display: none !important; }  .col-md-10.col-md-push-2 > .list.list-inline.pull-right.hidden-xs {     display: none !important; }  .col-md-10.col-md-push-2 > .alpha.text-muted {     display: none !important; }  html, body {     height: 100% !important; }  .page {     padding-top: 0 !important;     height: 100% !important; }  .page > .container {     width: 100% !important;     height: 100% !important; }  .page > .container > .row {     margin: 0 !important;     height: 100% !important; }  .page > .container > .row > .col-md-10.col-md-push-2 {     left: 0 !important;     width: 100% !important;     height: 100% !important;     float: none !important;     padding: 0 !important;     position: absolute !important; }  .sheet {     margin-top: 0 !important;     height: 100% !important; }  .chat-wrapper {     height: 100% !important; }  .chat-wrapper > .row {     height: 100% !important;     margin: 0 !important; }  .chat-wrapper > .row > .col-md-9, .chat-wrapper > .row > .col-md-3 {     margin-top: -30px !important;     padding: 30px 0 0 0 !important;     height: 100% !important; }  .chat {     height: 100% !important;     padding: 0 !important; }  .chat .activity {     padding-left: 0 !important; }  .timeline-chat {     padding: 0 !important; }  .activity-chat > .activity-avatar {     display: none !important; }  .activity-actions > .list-inline.pull-right.omega {     display: none !important; }  .js-insert-tips {     display: none !important; }  * {     font-family: monospace !important;     font-size: 13px !important; }  .timeline::before {     display: none !important; }  .chat-actor {     margin-left: 10px !important; }  .activity-actions, .activity-actions > .list-inline.omega {     float: left !important;     width: 125px !important; }  .activity-content {     float: left !important;     width: calc(100% - 125px) !important; }  .activity-content > p {     display: inline !important; }  .timeline-item, .activity-chat {     margin: 0 !important; }  .js-members .panel-heading, #collapseRecent {     display: none !important; }  .js-members .avatar, .js-members .indicator {     display: none !important; }  .timeline-insert .timestamp {     border: 0 !important;     padding: 0 !important;     margin-left: 125px !important; }  .timeline-insert .timestamp::before {     content: "last activity ";     display: inline; }   .js-members .panel-group, .js-members .panel, .js-members .panel-body {     height: 100% !important; }  .js-members .panel {     border-width: 0 0 0 1px !important;     border-radius: 0 !important; }  .chat-actions .pull-left {     display: none !important; }  .chat-actions {     padding: 0 !important;     border: none !important; }  .media-body textarea {     height: 30px !important; }  .timeline-item .media .pull-left {     display: none !important; }  .timeline-item .media .media-body {     margin-left: 125px !important; }  .timeline-item .media .media-body .activity-actions {     width: calc(100% - 125px) !important; }  .timeline-item .media .media-body .list-inline.omega {     display: inline !important;     float: none !important; }  .timeline-item .media .media-body .card.omega {     display: inline !important;     border: none !important;     padding: 0 !important; }  .timeline-item .media .media-body .card.omega code {     display: inline !important; }  .timeline {     padding: 0 !important; }';
    
        // create element
        var el = document.createElement('style');
        el.innerHTML = injectCSS;
        el.id = '#chat-extension-css-' + chat;

        // inject
        document.querySelector('#chat-' + chat).contentDocument.head.appendChild(el);
    };

    // shows a certain chat
    AssemblyChatExtension.prototype.showChat = function (chat) {
        document.querySelector('.current-chat').style.display = 'none';
        document.querySelector('.current-chat').classList.remove('current-chat');

        if (!document.querySelector('#chat-' + chat)) {
            window.chatExtension.injectChatFrame(chat);
        } else {
            document.querySelector('#chat-' + chat).style.display = 'block';
            document.querySelector('#chat-' + chat).classList.add('current-chat');
        }
    };

    // add extension to window object and load menu item
    window.chatExtension = new AssemblyChatExtension ();
    window.chatExtension.injectMenuItem();
})();
