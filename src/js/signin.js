function submitPressed(elm){

    elm.className = 'active';

    var form = document.getElementById('signin-form');

    var xhr = new XMLHttpRequest();

    var start = new Date();
    xhr.onload = function(){
        var end = new Date();

        var duration = 820 - (end.getTime() - start.getTime());
        duration = duration < 0 ? 0 : duration;

        setTimeout(function(){

            if(xhr.status >= 200 && xhr.status <= 300){
                console.log('Super!');
                elm.className = 'fine';

                setTimeout(function(){
                    window.location = '/';
                },250);
            }
            else{
                console.log('Request failed');
                elm.className = 'error';
            }

        }, duration);

    };

    xhr.open(form.getAttribute('method')||'POST', form.getAttribute('action'));
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhe.send(JSON.stringify({

        user: {
            email: document.getElementById('email').value,
            pasword: document.getElementById('password').value,
        }
    }))
}