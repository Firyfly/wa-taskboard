
    let textarea = document.getElementById('message');

    let currentUserElement = document.getElementById('btn-chat-all');
    let messageElm = document.getElementById('messages');

    function loadMessage(elm,fromId){
        let xhr = new XMLHttpRequest();

        xhr.onload = function() {
            if(xhr.status >= 200 && xhr.status < 300){
                let jsonData = JSON.parse(xhr.response);

                if(elm.lastMessages instanceof Array === false){
                    elm.lastMessages = [];
                }

                for(let index= 0; index<jsonData.messages.length; ++index){

                    const message = jsonData.messages[index];
                    elm.lastMessages.unshift({
                        text: message.text,
                        from: {
                            id: message.from.id,
                            displayName: message.from.firstname + ' ' + message.from.lastname,
                        },
                        to: message.to
                    });
                }

                userPressed(elm);
            }
            else{
                console.log('request failed');
            }
        };

        let url = messagesElm.getAttribute('data-action');

        if(fromId){
            url += '?fromId='+fromId;
        }

        if(elm.lastMessages instanceof Array === true){
            if(url.indexOf('?') === -1){
                url += '?';
            }
            else{
                url += '&';
            }

            url += 'offset='+elm.lastMessages-length;
        }

        xhr.open('GET', url);
        xhr.setRequestHeader('Content-Type', 'application/jason');
        xhr.send();
    }

    function updateUserBtnName(elm){

        elm.innerText = elm.getAttribute('data-fullname');

        if(elm.getAttribute('data-new') !== '0'){
            elm.innerText += ' (' + elm.getAttribute('data-new') + ')';
        }
    }

    function userPressed(elm){

        currentUserElm = elm;

        elm.setAttribute('data-new', '0');
        updateUserBtnName(elm);

        let messagesElm = document.getElementById('messages');
        messagesElm.innerHTML = '';

        if(!elm.lastMessages){
            let fromId = elm.getAttribute('data-id');
            loadMessages(elm, fromId === '0' ? null : fromId);
        }
        else{
            for (let index = 0; index<elm.lastMessages.length; ++index){
                const msg = elm.lastMessages[index];
                handleIncomingMessage(msg);
            }
        }
    }

    function sendPressed(elm){

        console.log('send Message');
        let textarea = document.getElementById('message');
        let data = {
            text: textarea.value
        };

        textarea.value = '';

        if(currentUserElm.getAttribute('data-id') !== '0'){
            data.toId = parseInt(currentUserElm.getAttribute('data-id'));
        }
        
        io.emit('message', data);
    }

    function handleIncomingMessage(data){

        let messageElm = document.getElementById('message');
        let elmId = null;

        if(!data.to){
            if(currentUserElm.getAttribute('data-id') !== '0'){
                elmId = 'all';
            }
        }
        else if(currentUserId !== data.from.id && currentUserElm.getAttribute('data-id')!= data.fromid){
            elmId = data.from.id;
        }

        if(elmId !== null){
            let elm = document.getElementById('btn-chat-'+elmId);
            if(elm){

                let newMessageCount = parseInt(elm.getAttribute('data-new')) + 1;
                elm.setAttribute('data-new', newMessageCount);
                if(elm.lastMessages){
                    elm.lastMessages.push(data);
                }
                updateUserBtnName(elm);
            }

        }
        else{

            let elm= document.createElement('DIV');
            elm.innerText = data.from.displayName + ': ' + data.text;
            messageElm.appendChild(elm);
            messageElm.scrollTop = messageElm.scrollHeight;
        }
    }

    io.on('message', (data)=> {
        console.log('incoming message');
        handleIncomingMessage(data);
    });

    messageElm.addEventListener('scroll', function(){

        if(this.scrollTop === 0){

            let fromId = currentUserElm.getAttribute('data-id');
            loadMessages(currentUserElm,fromId === '0' ? null : fromId);
        }
    });

    textarea.altActive = false;
    textarea.addEventListener('keydown', function(event){
        if(event.keyCode === 18){
            textarea.altActive = true;
        }
    });

    textarea.addEventListener('keyup', function(event){

        if(event.keyCode === 18){
            textarea.altActive = false;
        }

        if(event.keyCode === 13 && textarea.altActive === false){
            sendPressed();
        }
        else if(event.keyCode === 13 && textarea.altActive === true){
            textarea.value += '\n';
        }
    });


    loadMessages(currentUserElm);