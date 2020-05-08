let createProgressBar = (idOfBar, idOfBarText) => {
    return {
        progress: 0,
        run: function() {
            console.log(this.progress);
            if (this.progress == 0) {
                this.progress = 1;
                
                let elem = document.getElementById(idOfBar);
                let percentageP = document.getElementById(idOfBarText);
                let width = 10;
                let frame = () => {
                    if (width >= 100) {
                        clearInterval(id);
                        progress = 0;
                    } 
                    else {
                        width++;
                        elem.style.width = width + "%";
                        percentageP.innerHTML = "Progress: " + width + "%";
                    }
                }
                let id = setInterval(frame, 10);
                console.log(elem);
            }
        },
        setProgress: (progress) => {
                let elem = document.getElementById(idOfBar);
                let percentageP = document.getElementById(idOfBarText);
                elem.style.width = progress + "%";
                percentageP.innerHTML = progress + "%";
        }
    }
}   

let progressBar = createProgressBar("progressBar", "progressBarText");

