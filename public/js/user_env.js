
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
    function removeCollection(collectionId, authenticationToken) {
        fetch('api/remove-collection', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + authenticationToken
          },
          body: JSON.stringify({ collectionId: collectionId })
        })
        .then(function(response) {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error('Errore nella richiesta di rimozione: ' + response.status);
            }
          })
        .then(function(data) {
            if (data.message === 'Collection removed successfully') {
                console.log('Refresh in corso...');
                setTimeout(() => {
                    window.location.reload(true);
                }, 300); 
            } else {
                throw new Error('Errore nella rimozione: ' + data.message);
            }
        
        })
        .catch(function(error) {
          console.error(error);
        });
    }

    function toggleSiteStatus(collectionId, authenticationToken) {
        fetch('/api/getSiteStatus' , {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + authenticationToken
            },
            body: JSON.stringify({ collectionId: collectionId })
          })
            
            .then(response => response.json())
            .then(data => {
                const siteEnabled = data.enabled;
    
                if (siteEnabled) {
                    disableSite(collectionId, authenticationToken);
                } else {
                    enableSite(collectionId, authenticationToken);
                }
            })
            .catch(error => {
                console.error('Errore durante il recupero dello stato del sito dal database', error);
            });
    }
    
    function disableSite(collectionId, authenticationToken) {
        const stateImg = document.getElementById('stateImg');

        fetch('/api/changeSiteStatus', {
            method: 'POST',
            headers:  {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authenticationToken},
            body: JSON.stringify({ collectionId: collectionId })
        })
        .then(response => {
            // Gestisci la risposta del backend
            if (response.ok) {
                // La richiesta è stata elaborata correttamente
                stateImg.src = '../img/disabled.png';
            } else {
                // Si è verificato un errore nella richiesta
                console.error('Errore durante la disabilitazione del sito:', response.status, response.statusText);
            }
        })
        .catch(error => {
            console.error('Si è verificato un errore durante la richiesta:', error);
        });
        
    }
        
    function enableSite(collectionId, authenticationToken) {
        const stateImg = document.getElementById('stateImg');

        fetch('/api/changeSiteStatus', {
            method: 'POST',
            headers:  {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authenticationToken},
            body: JSON.stringify({ collectionId: collectionId })
        })
        .then(response => {
            // Gestisci la risposta del backend
            if (response.ok) {
                // La richiesta è stata elaborata correttamente
                stateImg.src = '../img/enabled.png'; 
            } else {
                // Si è verificato un errore nella richiesta
                console.error('Errore durante la disabilitazione del sito:', response.status, response.statusText);
            }
        })
        .catch(error => {
            console.error('Si è verificato un errore durante la richiesta:', error);
        });
        
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
            const data = await response.json(); //data contains all collections associated to user that send the request
            if (data.message === 'An error occurred'){
                console.log("An error occurred loading websites")
            }
            else{
                data.collection.forEach(element => {
                    var siteDiv = document.createElement('div')
                    siteDiv.classList.add("grid-item")
                    var nameP = document.createElement('p')
                    nameP.textContent = element.siteName
                    var spanType = document.createElement('span')
                    spanType.innerHTML = "Type: " + element.siteType
                    spanType.classList.add("hidden")
                    var rmvImg = document.createElement('img')
                    rmvImg.src = "../img/recycleBin.png"
                    rmvImg.id = "rmvImg";
                    rmvImg.addEventListener('click', function(event) {
                        event.stopPropagation();
                        var collectionId = element._id.toString();
                        const token = getTokenFromCookie();
                        Swal.fire({
                            title: 'Confirm',
                            text: 'Are you sure to delete this website?',
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonText: 'Delete',
                            cancelButtonText: 'Cancel',
                            
                          }).then((result) => {
                            if (result.isConfirmed) {
                              // L'utente ha confermato l'azione, chiama la funzione removeCollection
                              removeCollection(collectionId, token);
                            } else {
                              // L'utente ha annullato l'azione, non fare nulla
                            }
                          });
                      });
                      rmvImg.classList.add("hidden")
                    
                    
                    const stateImg = document.createElement('img');
                    fetch('/api/getSiteStatus' , {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': 'Bearer ' + getTokenFromCookie()
                        },
                        body: JSON.stringify({ collectionId: element._id.toString() })
                      })
                        
                        .then(response => response.json())
                        .then(data => {
                            const siteEnabled = data.enabled;
                
                            if (siteEnabled) {
                                stateImg.src="../img/enabled.png"
                            } else {
                                stateImg.src ="../img/disabled.png"
                            }
                        })
                        .catch(error => {
                            console.error('Errore durante il recupero dello stato del sito dal database', error);
                        });
                    stateImg.setAttribute('id', "stateImg")
                    stateImg.addEventListener('click', (event) => {
                        event.stopPropagation();
                        var collectionId = element._id.toString();
                        const token = getTokenFromCookie();
                        
                        Swal.fire({
                            title: 'Confirm',
                            text: 'Are you sure you want to turn on/off site status?',
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonText: 'Confirm',
                            cancelButtonText: 'Cancel',
                        }).then((result) => {
                            if (result.isConfirmed) {
                                toggleSiteStatus(collectionId, token);
                            }
                        });
                    });
                    
                
                    siteDiv.appendChild(stateImg)
                    siteDiv.appendChild(rmvImg)
                    siteDiv.appendChild(nameP)
                    siteDiv.appendChild(spanType)
                    siteDiv.addEventListener('mouseover', function(){
                        this.style.backgroundColor = '#89929b';
                        nameP.style.color = '#000000';
                        spanType.style.color = '#000000';
                        spanType.classList.remove("hidden");
                        spanType.classList.add("visible");
                        rmvImg.classList.remove("hidden");
                    });
                    siteDiv.addEventListener('mouseout', function(){
                        this.style.backgroundColor = '#21262d';
                        nameP.style.color = '#c6cdd5';
                        spanType.style.color = '#c6cdd5';
                        spanType.classList.remove("visible");
                        spanType.classList.add("hidden");
                        rmvImg.classList.add("hidden")
                    });
                    siteDiv.addEventListener('click',function (){
                        const url = 'https://'+ element.siteName+'.z6.web.core.windows.net/'; 
                        window.open(url, '_blank');
                    })
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

   
    let fetchInfo = { promise: null, timerId: null };
    nameSite.addEventListener("input", function () {
        if(fetchInfo.promise){
            clearTimeout(fetchInfo.timerId);
        }
        fetchInfo.promise = new Promise((resolve)=>{
            fetchInfo.timerId = setTimeout(function() {
                nameSite.style.backgroundColor = 'inherit'
                const nomeSito = nameSite.value.trim();
                const isValidName = /^[a-z][a-z0-9]{2,23}$/.test(nomeSito)
                if (nomeSito.length > 0 && isValidName) {
                    let azureFunctionUrl;
                    if (window.location.href.startsWith('https://prod-app-srs')) {
                        azureFunctionUrl = 'https://prod-functions-srs.azurewebsites.net/api/check-name';
                    }else if(window.location.href.startsWith('https://test-app-srs')){
                        azureFunctionUrl = 'https://test-functions-srs.azurewebsites.net/api/check-name';
                    } else {
                        azureFunctionUrl = 'https://dev-functions-srs.azurewebsites.net/api/check-name';
                    }

                    // Resto del codice

                    const url = `${azureFunctionUrl}?nomeSito=${nomeSito}`;
                    
                    fetch(url)
                        .then(response => response.text())
                        .then(data => {
                        // Gestisci la risposta della richiesta
                            console.log(data);
        
                            if (data === "DISPONIBILE") {
                                submitButton.style.pointerEvents = "auto";
                                submitButton.style.opacity = 1;
                                error.style.display = "none";
                            } else {
                                submitButton.style.pointerEvents = "none";
                                submitButton.style.opacity = 0.5;
                                error.style.display = "block";
                                error.textContent ="This name is already in use"
                            }
                            resolve()
                        })
                        .catch(error => {
                        // Gestisci eventuali errori
                            console.error('Si è verificato un errore:', error);
                            resolve()
                        });
    
                } else if (nomeSito==="") {
                    submitButton.style.pointerEvents= "none";
                    submitButton.style.opacity = 0.5
                    error.style.display = "block";
                    error.textContent ="Please insert a valid name"
                    resolve()
                } else {
                    submitButton.style.pointerEvents = "none";
                    submitButton.style.opacity = 0.5;
                    error.style.display = "block";
                    error.textContent = "The name must start with a lowercase letter and can only contain lowercase letters and numbers. It should be between 3 and 24 characters long.";
                    resolve();
                }
            }, 400);
        })
        
    });

        const selectElement = document.getElementById("type");
        const container = document.getElementById("template-cont");
        const settingContainer = document.getElementById("setting-cont");

        let templateID = '00';
        let settings= {} ;

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
        if(templateID.charAt(0)==='1'){
            const settingName = document.getElementById('nameNews-input')
            const catOptionsWrapper = document.getElementById('cat-options-wrapper')
            const additionalCategories = document.getElementById('add-cat-input').value.split(',').map(category => category.trim());
            const selectedCategories = Array.from(catOptionsWrapper.querySelectorAll('input[name="category"]:checked')).map(checkbox => checkbox.value);
            const settingNumArt = document.getElementById('numArticle-input')
            const settingPageLen = document.getElementById('page-len-select')
            settings.name = settingName.value 
            if(additionalCategories===""){
                settings.categories = selectedCategories;
            }else{
                settings.categories = selectedCategories.concat(additionalCategories);  
            }
            if (settings.categories.length <4){
                event.preventDefault();
                return
            }
            settings.nArt = settingNumArt.value
            settings.pageLen = settingPageLen.value
        }
        console.log(settings)
        // Mostra la finestra di caricamento
        const loadingOverlay = document.getElementById("loading-overlay");
        loadingOverlay.style.display = "flex";
      });
     

        

      
          
        selectElement.addEventListener("change", (event) => {
            const valSelector = event.target.value;
            
            // Clear previous divs
            container.innerHTML = "";
            settingContainer.innerHTML="";
            
            // Create n divs
            if (valSelector =="news") {
             for(let i=0;i<1;i++){
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

             //Settings for News
             const nameLbl = document.createElement('label')
             nameLbl.innerHTML = "Name of your News company: "
             const inpName =document.createElement('input')
             inpName.classList.add("setting-long-input")
             inpName.setAttribute('id', 'nameNews-input')
             inpName.setAttribute('type', 'text');
             inpName.setAttribute('value', '');

            const categoryLbl = document.createElement('label');
            categoryLbl.innerHTML = 'Choose the categories: ';
            const categories = ['Business', 'Sports', 'Weather', 'Tech', 'Politics', 'Economy','Entertainment', 'Health', 'Science','Culture and Art','Crime','Environment','Travel','Lifestyle','Education','Fashion', 'Food', 'Events','Music','Religion', 'Other'];
            const categoryOptionsWrapper = document.createElement('div');
            categoryOptionsWrapper.setAttribute('id', 'cat-options-wrapper')
            categories.forEach(category => {
                const checkbox = document.createElement('input');
                checkbox.setAttribute('type', 'checkbox');
                checkbox.setAttribute('name', 'category');
                checkbox.setAttribute('value', category);

                const categoryLbl = document.createElement('label');
                categoryLbl.innerHTML = category;

                const categoryOption = document.createElement('div');
                categoryOption.appendChild(checkbox);
                categoryOption.appendChild(categoryLbl);
                categoryOptionsWrapper.appendChild(categoryOption);
            });
            const otherCheckbox = categoryOptionsWrapper.querySelector('input[value="Other"]');
            const additionalCategoriesInput = document.createElement('input');
            additionalCategoriesInput.classList.add('setting-long-input');
            additionalCategoriesInput.setAttribute('type', 'text');
            additionalCategoriesInput.setAttribute('placeholder', 'example: cat1, cat2, cat3, ...');
            additionalCategoriesInput.setAttribute('id', 'add-cat-input')
            additionalCategoriesInput.style.display = 'none';

            

            otherCheckbox.addEventListener('change', () => {
            if (otherCheckbox.checked) {
                additionalCategoriesInput.style.display = 'block';
            } else {
                additionalCategoriesInput.style.display = 'none';
            }
            });

            categoryOptionsWrapper.appendChild(additionalCategoriesInput);

             const lbl = document.createElement("label");
             lbl.innerHTML = 'Number of articles for each category: ';
             const inpNumArt =document.createElement("input");
             inpNumArt.classList.add("setting-input");
             inpNumArt.setAttribute('id', 'numArticle-input')
             inpNumArt.setAttribute('type', 'text');
             inpNumArt.setAttribute('value', '');
             
             const lbl2 = document.createElement("label");
             lbl2.innerHTML = 'Page length: ';
             const selectPageLen = document.createElement("select");
             selectPageLen.classList.add("setting-input");
             selectPageLen.setAttribute('id','page-len-select')
             // Opzione 1: Short
            const optionShort = document.createElement("option");
            optionShort.value = 'short';
            optionShort.text = 'Short';

            // Opzione 2: Medium
            const optionMedium = document.createElement("option");
            optionMedium.value = 'medium';
            optionMedium.text = 'Medium';

            // Opzione 3: Big
            const optionBig = document.createElement("option");
            optionBig.value = 'big';
            optionBig.text = 'Big';

            // Aggiungi le opzioni al selettore
            selectPageLen.appendChild(optionShort);
            selectPageLen.appendChild(optionMedium);
            selectPageLen.appendChild(optionBig);
             
             
             const settingOptions = document.createElement("div");
             settingOptions.appendChild(nameLbl)
             settingOptions.appendChild(inpName)
             settingOptions.appendChild(categoryLbl);
             settingOptions.appendChild(categoryOptionsWrapper);
             settingOptions.appendChild(lbl);
             settingOptions.appendChild(inpNumArt);
             settingOptions.appendChild(lbl2);
             settingOptions.appendChild(selectPageLen);
             settingContainer.appendChild(settingOptions);
            }
            if (valSelector =="blog") {
             for(let i=0;i<1;i++){
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
             for(let i=0;i<1;i++){
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
             for(let i=0;i<1;i++){
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
            if (data.message === 'Collection added successfully'){
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

     
    
    
