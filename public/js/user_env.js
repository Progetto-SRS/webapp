

window.onload = function() {
    function getTokenFromCookie() {
        const cookies = document.cookie.split(';');
        
        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          
          // Controlla se il cookie contiene il token desiderato
          if (cookie.startsWith('token=')) {
            const token = cookie.substring('token='.length);
            return token;
          }
        }
        
        // Restituisci null se il cookie del token non è stato trovato
        return null;
      }

    function onClick(){
            const addPnl = document.getElementById("add-pnl");
            var span = document.getElementsByClassName("close")[0];
            addPnl.style.display = "block";
            span.onclick = function() {
             addPnl.style.display = "none";
            }
            window.onclick = function(event) {
              if (event.target == addPnl) {
                addPnl.style.display = "none";
              }
            }
            
    }
    async function loadCollections(){
        const sitesContainer = document.querySelector(".sites-container")
        try {
            const token = getTokenFromCookie();
        
            const response = await fetch('api/load-collections', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }            
            });  
            const data = await response.json();
            if (data.message === 'An error occurred'){
                console.log("An error occurred loading websites")
            }
            else{
                console.log(data)
                data.collection.forEach(element => {
                    var siteDiv = document.createElement('div')
                    siteDiv.classList.add("grid-item")
                    var nameP = document.createElement('p')
                    nameP.textContent = element.siteName
                    var spanType = document.createElement('span')
                    spanType.innerHTML = "Type: " + element.siteType
                    spanType.classList.add("hidden")
                    siteDiv.appendChild(nameP)
                    siteDiv.appendChild(spanType)
                    siteDiv.addEventListener('mouseover', function(){
                        this.style.backgroundColor = '#89929b';
                        spanType.classList.remove("hidden");
                        spanType.classList.add("visible");
                    });
                    siteDiv.addEventListener('mouseout', function(){
                        this.style.backgroundColor = '#21262d';
                        spanType.classList.remove("visible");
                        spanType.classList.add("hidden");
                    });
                    sitesContainer.appendChild(siteDiv)
                    
                });
            }
          } catch (error) {
            console.error(error);
          }

    }
    async function loadUsername(){
        const UserTitle = document.getElementById('user-title')
        try {
            const token = getTokenFromCookie();
        
            const response = await fetch('api/load-username', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }            
            });  
            const data = await response.json();
            if (data.message === 'An error occurred'){
                console.log("An error occurred loading username")
            }
            else{
                UserTitle.textContent = UserTitle.textContent + data.username
            }
          } catch (error) {
            console.error(error);
          }

    }

    loadCollections();
    const gridItems = document.querySelectorAll('.grid-item')
    gridItems.forEach(element =>{
        element.addEventListener('mouseover', function(){
            this.style.backgroundColor = '#89929b';
        });
        element.addEventListener('mouseout', function(){
            this.style.backgroundColor = '#21262d';
        });
    })
    loadUsername();
    document.querySelector("#add-btn").addEventListener("click", onClick);
    const addSiteForm = document.getElementById('addsite-form');
    const nameSite = document.getElementById("sitename");
    const submitButton = document.getElementById("submitButton");
    const error = document.getElementById("error");
    const error2 = document.getElementById("error2");

    nameSite.addEventListener("input", function () {
        nameSite.style.backgroundColor = 'inherit'
        if (nameSite.value.trim().length > 0) {
            submitButton.style.opacity=1;
            submitButton.style.pointerEvents= "auto";
            error.style.display = "none";
        } else if (nameSite.value.trim()==="") {
            submitButton.style.pointerEvents= "none";
          submitButton.style.opacity = 0.5
            error.style.display = "block";
        }
    });

        const selectElement = document.getElementById("type");
        const container = document.getElementById("template-cont");
        const settingContainer = document.getElementById("setting-cont");

        let templateID = '00';
        let settings= [] ;

    submitButton.addEventListener("click", function (event) {
        if (nameSite.value.trim() === "") {
          event.preventDefault();
          error.style.display = "block";
          return
          
        }
        if(templateID==='00'){
            event.preventDefault();
            error2.style.display ="block"
            return
        }
      });
     

        

      
          
          selectElement.addEventListener("change", (event) => {
            const valSelector = event.target.value;
            
            // Clear previous divs
            container.innerHTML = "";
            settingContainer.innerHTML="";
            
            // Create n divs
            if (valSelector =="news") {
             for(let i=0;i<3;i++){
              var divElement = document.createElement("div");
              divElement.classList.add("grid-item");
              divElement.classList.add("cell");
              var spanElement =document.createElement("span")
              spanElement.setAttribute('id','template-id')
              spanElement.classList.add("hidden")
              spanElement.innerHTML="1" + i
              divElement.appendChild(spanElement)
              var pEl = document.createElement("p");
              pEl.classList.add("temp-name");
              pEl.textContent = 'Template News '+ (i+1);
              divElement.appendChild(pEl);
              //divElement.textContent = `Div ${i+1}`;
              container.appendChild(divElement);
             };
             const lbl = document.createElement("label");
             lbl.innerHTML = 'Number of articles: ';
             const inpNumArt =document.createElement("input");
             inpNumArt.classList.add("setting-input");
             inpNumArt.setAttribute('type', 'text');
             inpNumArt.setAttribute('value', '');
             
             const lbl2 = document.createElement("label");
             lbl2.innerHTML = 'Page length: ';
             const inpPageLen =document.createElement("input");
             inpPageLen.classList.add("setting-input");
             inpPageLen.setAttribute('type', 'text');
             inpPageLen.setAttribute('value', '');
             
             const settingOptions = document.createElement("div");
             settingOptions.appendChild(lbl);
             settingOptions.appendChild(inpNumArt);
             settingOptions.appendChild(lbl2);
             settingOptions.appendChild(inpPageLen);
             settingContainer.appendChild(settingOptions);
            }
            if (valSelector =="blog") {
             for(let i=0;i<5;i++){
              var divElement = document.createElement("div");
              divElement.classList.add("grid-item");
              divElement.classList.add("cell");
              var spanElement =document.createElement("span")
              spanElement.setAttribute('id','template-id')
              spanElement.classList.add("hidden")
              spanElement.innerHTML="2" + i
              divElement.appendChild(spanElement)
              var pEl = document.createElement("p");
              pEl.classList.add("temp-name");
              pEl.textContent = 'Template Blog '+ (i+1);
              divElement.appendChild(pEl);
              //divElement.textContent = `Div ${i+1}`;
              container.appendChild(divElement);
             };
            }
            if (valSelector =="e-commerce") {
             for(let i=0;i<2;i++){
              var divElement = document.createElement("div");
              divElement.classList.add("grid-item");
              divElement.classList.add("cell");
              var spanElement =document.createElement("span")
              spanElement.setAttribute('id','template-id')
              spanElement.classList.add("hidden")
              spanElement.innerHTML="3" + i
              divElement.appendChild(spanElement)
              var pEl = document.createElement("p");
              pEl.classList.add("temp-name");
              pEl.textContent = 'Template E-commerce '+ (i+1);
              divElement.appendChild(pEl);
              //divElement.textContent = `Div ${i+1}`;
              container.appendChild(divElement);
             };
            }
            if (valSelector =="portfolio") {
             for(let i=0;i<4;i++){
              var divElement = document.createElement("div");
              divElement.classList.add("grid-item");
              divElement.classList.add("cell");
              var spanElement =document.createElement("span")
              spanElement.setAttribute('id','template-id')
              spanElement.classList.add("hidden")
              spanElement.innerHTML="4" + i
              divElement.appendChild(spanElement)
              var pEl = document.createElement("p");
              pEl.classList.add("temp-name");
              pEl.textContent = 'Template Portfolio '+(i+1);
              divElement.appendChild(pEl);
              //divElement.textContent = `Div ${i+1}`;
              container.appendChild(divElement);
             };
            }
            const cells = document.querySelectorAll('.cell');
            let isCellClicked = false;
            let selectedCell;
    
            function highlightCell() {
             if (!isCellClicked) {
              this.style.backgroundColor = '#89929b';
             }
            }
            
            function unhighlightCell() {
              if (!isCellClicked && this !== selectedCell) {
                this.style.backgroundColor = '#21262d';
              }
            }
            
            function selectCell() {
                  if (isCellClicked) {
                        return;
                  }
              isCellClicked = true;
              if (selectedCell) {
                selectedCell.classList.remove('selected');
                selectedCell.style.backgroundColor = '#21262d';
              }
              selectedCell = this;
                     cells.forEach(cell => {
                      if(cell !== selectedCell){
                       cell.style.opacity ="0.4";
                      }
                     });
              selectedCell.classList.add('selected');
              selectedCell.style.backgroundColor = '#333';

              templateID = selectedCell.querySelector('#template-id').textContent;
              error2.style.display ="none"
            }
            function resetCell() {
              isCellClicked = false;
              this.style.opacity ="1";
            }
            
            cells.forEach(cell => {
              cell.addEventListener('mouseover', highlightCell);
              cell.addEventListener('mouseout', unhighlightCell);
              cell.addEventListener('click', selectCell);
              cell.addEventListener('mouseup', resetCell);
            });
        });
        
        addSiteForm.addEventListener('submit', async (e) => {
            e.preventDefault();
        try {
            const token = getTokenFromCookie();
        
            const response = await fetch('api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ siteName: nameSite.value, siteType: selectElement.value, template: templateID, settings })
            });
               
            const data = await response.json();
            if (data.message === 'Collection added succesfully'){
                console.log('Refresh in corso...');
                setTimeout(() => {
                    window.location.reload(true);
                }, 1000);
            }
            else{
                console.log(data)
            }
          } catch (error) {
            console.error(error);
          }
    })
};

     
    
    