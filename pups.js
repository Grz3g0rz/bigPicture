/*
	 Skrypt jest darmowy, poki ten komentarz w nim pozostaje.
	 Released under Creative Commons License
	 http://creativecommons.org/licenses/by/2.0/

	 Original author: Kornel Lesinski
	 https://kornel.ski/pups/
*/

/* sposob uzycia tego wszystkiego znajdziesz na koncu pliku */



/** to taki smieszny sposob definiowania funkcji, nie przejmuj sie */
var pornpups =
{
    /** uaktywnia wszystkie linki w podanym elemencie. z pewnoscia chcesz to wywolac (patrz koniec tego pliku) */
    init: function (element) {
        /** wymagany jest element i obsluga DOM */
        if (!element || !element.getElementsByTagName) { return false; }

        var as = element.getElementsByTagName('a');
        for (var i = 0; i < as.length; i++) {
            /* dzieki ponizszej linijce upopupiane sa tylko linki do obrazkow. zakomentuj ja i bedzie dzialalo na wszystkie. mozesz tez zmienic warunek zeby dzialalo np. tylko na linki z okreslona klasa (tip: .className) */
            if ((as[i].href + '').match(/\.(jpe?g|png|gif)/i))
                as[i].onclick = this.click;
        }

        return true;
    },

    /** tworzenie dokumentu, ktory jest w nowootwartym oknie. zmien HTML wg gustu */
    writedoc: function (win, href, title, alt, h) {
        var doc = win.document;
        doc.open('text/html;charset=UTF-8');
        doc.write(
            '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">' +
            '<html id="popup">' +
            '<head><title>' + alt + '</title>' +
            '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">' +
            '<meta http-equiv="imagetoolbar" content="false">' +
            '<link rel="stylesheet" href="/pups/pornpups.css">' +
            (h ? '<style type="text/css">.obrazek {min-height: ' + h + 'px} #iesux#popup .obrazek {height: ' + h + 'px;}</style>' : '') +
            /* w FF1.5 klik nie zawsze zamykał przy body.onmouseup */
            '</head><body onclick="window.close();">' +
            (title ? '<p class="tytul">' + title + '</p>' : '') +
            '<p class="obrazek"><img src="' + href + '" alt="' + alt + '"></p>' +
            '<p class="klik">Kliknik aby zamknąć / Click to close / Zum Schließen drücken</p>' +
            '</body></html>'
        );
        doc.close();
    },

	/** funkcja ma za zadanie wydobyc wymiary z podanego ciagu (tytulu linku)
		zwraca tablice zawierajaca ladnie sformatowany tytul oraz
		wymiary pobrane z podanego ciagu w formacie dla window.open

		zmien ta funkcje, jesli chcesz zapisywac wymiary w inny sposob
	*/
    title2size: function (str) {
        if (str) {
            /* wyrazenie regularne szuka czegos na wzor "(111x222)" */
            var out = str.match(/\(([0-9]+)x([0-9]+)\)/);

            /* po czym usuwa znaleziony fragment */
            if (out) return new Array(str.replace(/\(([0-9]+)x([0-9]+)\)/g, ''), parseInt(out[1]), parseInt(out[2]));
        }
        /* w przypadku problemow - podaje wartosci domyslne (zmien na takie, jakie ci pasuja) */
        return new Array(str, 550, 420);
    },

    /** obsluga klikniecia */
    click: function (ev) {
        ev = ev || event; /* IEizm */
        /* jesli okno tej miniatury jest otwarte - zamknij (będzie otworzone jeszcze raz, jakby użytkownik zgubił poprzednie...) */
        try {
            if (this.pp_win && this.pp_win.close && !this.pp_win.closed) { this.pp_win.close(); this.pp_win = false; }
        }
        /* explorer ma z tym dziwne problemy, ktore na szczescie mozna olac */
        catch (e) { }

        try {
            /* znajdz obrazek, jego alt i title */
            var imgs = this.getElementsByTagName('img');
            var title = imgs[0].getAttribute('title') ? imgs[0].getAttribute('title') : this.getAttribute('title');
            var alt = imgs[0].getAttribute('alt');

            /* parametry okna, z wymiarami (tu wymiary sa powiekszane, aby bylo troche miejsca wokol obrazka) */
            var titleandsize = pornpups.title2size(title);
            var winopts = "dependent=yes,toolbar=no,resizable=yes,width=" + (titleandsize[1] + 30) + ',height=' + (titleandsize[2] + 60);

            /* do the boogie! */
            var win = window.open(this.href, '_blank', winopts);
            if (win && win.opener) {
                this.pp_win = win;
                pornpups.writedoc(win, this.href, titleandsize[0], alt, titleandsize[2]);
                if (ev.stopPropagation) ev.stopPropagation();
                return false;
            }
        }
        /* siatka bezpieczenstwa, jakby ktoras funkcja nawalila */
        catch (e) { }

        /* jesli nie udalo sie otworzyc okna - zwraca true, co otwiera obrazek w tym samym oknie */
        return true;
    },

    initNow: function () {
        this.init(document.body);
    },

    initLoad: function () {
        var oldOnload = window.onload;
        var that = this;
        window.onload = function () {
            if (oldOnload) try { oldOnload(); } catch (e) {/*explorer dziwne rzeczy plecie*/ }
            that.initNow();
        }
    }
};

/** wystarczy wywolac jedno z ponizszych */

/** inicjalizacja przy onload (po zaladowaniu wszsystkich miniatur) */
pornpups.initLoad();

/** inicjalizacja natychmiastowa. MUSI byc wykonana w body ZA wszystkimi linkami, na ktore ma dzialac */
pornpups.initNow();
