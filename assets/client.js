let config;

async function page(){
    let paste = $n("textarea").id("paste").keydown(function(event) {
		if (event.keyCode == 9) { //tab was pressed
			var newCaretPosition;
			newCaretPosition = this.getCaretPosition() + "    ".length;
			this.value = this.value.substring(0, this.getCaretPosition()) + "    " + this.value.substring(this.getCaretPosition(), this.value.length);
			this.setCaretPosition(newCaretPosition);
			return false;
		}
		if(event.keyCode == 8){ //backspace
			if (this.value.substring(this.getCaretPosition() - 4, this.getCaretPosition()) == "    ") { //it's a tab space
				var newCaretPosition;
				newCaretPosition = this.getCaretPosition() - 3;
				this.value = this.value.substring(0, this.getCaretPosition() - 3) + this.value.substring(this.getCaretPosition(), this.value.length);
				this.setCaretPosition(newCaretPosition);
			}
		}
		if(event.keyCode == 37){ //left arrow
			var newCaretPosition;
			if (this.value.substring(this.getCaretPosition() - 4, this.getCaretPosition()) == "    ") { //it's a tab space
				newCaretPosition = this.getCaretPosition() - 3;
				this.setCaretPosition(newCaretPosition);
			}    
		}
		if(event.keyCode == 39){ //right arrow
			var newCaretPosition;
			if (this.value.substring(this.getCaretPosition() + 4, this.getCaretPosition()) == "    ") { //it's a tab space
				newCaretPosition = this.getCaretPosition() + 3;
				this.setCaretPosition(newCaretPosition);
			}
        }
	});
    let actionButtons = $n("div").id("action-buttons");

    let actionButtonList = {
        save: $n("a").text("save").id("save").click(function(){
            let randomKey = Math.random().toString(36).substring(5);
            Cajax.post(config.server, {
                contents: CryptoJS.AES.encrypt(paste.val(), randomKey).toString()
            }).then((res)=>{
                const parsed = JSON.parse(res.responseText);
                if (parsed.success) {
                    window.location.hash = parsed.url+"!"+randomKey;
                    $("body").html("");
                    page();
                }
            }).send();
        }),
        edit: $n("a").text("edit").id("edit")
    };

    actionButtons.append(actionButtonList.save);

    if (window.location.hash === "") {
        
    } else {
        configRequest.then(()=>{
            Cajax.get(config.server, {
                paste: window.location.hash.split("#")[1].split("!")[0]
            }).then((res)=>{
                const pasteCode = CryptoJS.AES.decrypt(JSON.parse(res.responseText).content, window.location.hash.split("#")[1].split("!")[1]).toString(CryptoJS.enc.Utf8);
                actionButtons.append(actionButtonList.edit);
                paste.val(pasteCode.replace("\n", "\\n"));
                paste.toggle();
                let pre = $n("pre").append(
                    $n("code").text(pasteCode)
                );
                $("body")
                    .append(pre);
                actionButtonList.save.toggle();
                actionButtonList.edit.click(function(){
                    paste.toggle();
                    pre.toggle();
                    actionButtonList.edit.toggle();
                    actionButtonList.save.toggle();
                });
                hljs.initHighlighting.called = false;
                hljs.initHighlighting();
            }).send();
        });
    }

    $("body")
        .append(paste)
        .append(actionButtons)
        .append($n("a").id("snackbar"));
}

var snackBarTimeout;
  
function showSnackBar(text, color="#17fc2e", background="#1e212b") {
    var snackbar = document.querySelector('#snackbar');
    snackbar.textContent = text;
    snackbar.style.color = color;
    snackbar.style.backgroundColor = background;
    snackbar.classList.add('show');
    clearTimeout(snackBarTimeout);
    snackBarTimeout = setTimeout(() => {
        snackbar.classList.remove('show');
    }, 1500);
}

var configRequest = Prajax.get("config.json").then((res)=>{
    config = JSON.parse(res.responseText);
});

$(document).ready(function(){
    page();
});