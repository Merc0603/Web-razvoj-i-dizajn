
let preuzmi = () => {
    //https://restapiexample.wrd.app.fit.ba/ -> Ispit20230624 -> GetPonuda

    let url = `https://restapiexample.wrd.app.fit.ba/Ispit20230624/GetPonuda?travelfirma=${firma.value}`
    destinacije.innerHTML = '';//brisemo destinacije koje su hardkodirane (tj. nalaze se u HTML-u)
    fetch(url)
        .then(r => {
            if (r.status !== 200) {
                //greska
                return;
            }
            r.json().then(t => {

                let b = 0;
                for (const x of t.podaci) {
                    b++;
                    destinacije.innerHTML += `
                    <article class="offer">
                        <div class="akcija">${x.akcijaPoruka}</div>
                        <div  class="offer-image" style="background-image: url('${x.imageUrl}');" ></div>
                        <div class="offer-details">
                            <div class="offer-destination">${x.mjestoDrzava}</div>        
                            <div class="offer-price">$${x.cijenaDolar}</div>                                
                        </div>
                        <div class="offer-footer">
                            <div class="offer-description">${x.opisPonude}</div>
                        
                            <select id="s${b}" class="offer-option">
                            ${generisiOpcije(x)}
                                </select>          
                            <div class="ponuda-dugme" onclick="dugme(this)">Odaberi</div>
                        </div>
                    </article>
                `
                }
            })
        })
}

function dugme(n) {
    let destinacija = n.parentElement.parentElement.querySelector(".offer-destination").innerText;
    let dodatnaCijena = n.parentElement.querySelector("select").value.split("$").pop();
    let soba = n.parentElement.querySelector("select").value.split("+").shift();
    let cijena = n.parentElement.parentElement.querySelector(".offer-price").innerHTML.substring(1);

    document.getElementById("destinacija").value = destinacija;
    document.getElementById("soba").value = soba;
    document.getElementById("cijenaPoGostu").value = cijena;




    for (let i = 0; i < brojGostiju.value; i++) {
        ukupnaCijena.value = Number(document.getElementById("cijenaPoGostu").value) * Number(document.getElementById("brojGostiju").value) + Number(dodatnaCijena);
    }


}
let generisiOpcije = (x) => {
    let s = "";
    for (const o of x.sobe) {
        s += `<option>${o.oznakaSobe}  +$${o.cijenaDoplate}</option>`
    }
    return s;
}


let ErrorBackgroundColor = "#FE7D7D";
let OkBackgroundColor = "#DFF6D8";

let posalji = () => {
    //https://restapiexample.wrd.app.fit.ba/ -> Ispit20230624 -> Add

    let jsObjekat = new Object();

    jsObjekat.travelFirma=firma.value;
    jsObjekat.destinacijaDrzava=destinacija.value;
    jsObjekat.brojIndeksa=brojIndeksa.value;
    jsObjekat.gosti=[]; //prazan niz koji se tek puni u linijama ispod
    jsObjekat.poruka=messagetxt.value;
    jsObjekat.telefon=phone.value;
    jsObjekat.oznakaSoba=soba.value;

    document.querySelectorAll("#firstname").forEach(f=>{
        jsObjekat.gosti.push(f.value);
    })

    let jsonString = JSON.stringify(jsObjekat);

    console.log(jsObjekat);
    let url = "https://restapiexample.wrd.app.fit.ba/Ispit20230624/Add";

    let greske = "";
    greske += provjeriIndeks();
    greske += provjeriTelefon();
    //itd za ostale textboxove

    if (greske.length > 0) {
        alert("greske su: " + greske);
        return;//prekid funkcije
    }

   
    //fetch tipa "POST" i saljemo "jsonString"
    fetch(url, {
        method: "POST",
        body: jsonString,
        headers: {
            "Content-Type": "application/json",
        }
    })
        .then(r => {
            if (r.status != 200) {
                alert("Greška")
                return;
            }

            r.json().then(t => {
                alert("Uspješna rezervacija. Broj rezervacije je:" + t.idRezervacije)

            })

        })
}

let popuniFimeUCombox = () => {
    let urlFirme = "https://restapiexample.wrd.app.fit.ba/Ispit20230624/GetTravelFirme";

    fetch(urlFirme)
        .then(obj => {
            if (obj.status != 200) {
                window.alert("Greska pri komunikaciji sa serverom!");
                return;
            }
            obj.json().then(element => {
                element.forEach(e => {
                    firma.innerHTML += `<option>${e.naziv}</option>`;
                });

                preuzmi();
            })
        })
        .catch(error => {
            window.alert("Greska!" + error);
        })
}
popuniFimeUCombox();


let promjenaBrojaGostiju = () => {
    console.log("novi broj gostiju je " + brojGostiju.value)

    gosti.innerHTML = ""; //brise stare textboxove


    for (let i = 0; i < brojGostiju.value; i++) {
        gosti.innerHTML +=
            `  <div class="container">
                    <div class="item">
                        <label for="firstname">Gost  ${i + 1}: First name</label>
                        <input type="text" id="firstname"  />
                    </div>
                </div>`;

    }

}

let provjeriIndeks = () => {
    let r = /^IB\d{6}$/
    if (!r.test(brojIndeksa.value)) {
        brojIndeksa.style.backgroundColor = ErrorBackgroundColor;
        return "Pogresan indeks! ";
    }
    else {
        brojIndeksa.style.backgroundColor = OkBackgroundColor;
        return "";
    }
}


let provjeriTelefon = () => {
    let r = /^\+\d{3}-\d{2}-\d{3}-\d{3}$/
    if (!r.test(phone.value)) {
        phone.style.backgroundColor = ErrorBackgroundColor;
        return "Pogresan email";
    }
    else {
        phone.style.backgroundColor = OkBackgroundColor;
        return "";
    }
}