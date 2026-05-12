$(function () {
    const canales = ['#inicio', '#dia', '#cv', '#rol', '#poke-voice', '#zoogenesis', '#libros'];
    let canalActual = 0;
    let ultimoCanalEncendido = 0;
    let cambioPendiente;
    let quitarRuidoPendiente;

    function activarCanal($canal) {
        if ($canal.is('#inicio, #apagado')) {
            $canal.css('display', 'flex');
        } else {
            $canal.show();
        }

        $canal.addClass('actual');
    }

    function ocultarCanal($canal) {
        $canal.hide().removeClass('actual');
    }

    $('.canal').hide().removeClass('actual');
    activarCanal($('#inicio'));

    function prepararArrastrables() {
        $('.draggable').each(function () {
            const elemento = this;
            const $elemento = $(elemento);
            let offsetX = 0;
            let offsetY = 0;

            $elemento.on('pointerdown', function (event) {
                const pointerEvent = event.originalEvent;

                if (pointerEvent.pointerType === 'mouse' && pointerEvent.button !== 0) {
                    return;
                }

                const rect = elemento.getBoundingClientRect();

                offsetX = pointerEvent.clientX - rect.left;
                offsetY = pointerEvent.clientY - rect.top;

                $elemento.css({
                    left: rect.left,
                    top: rect.top,
                    right: 'auto',
                    bottom: 'auto'
                });

                elemento.setPointerCapture(pointerEvent.pointerId);
                event.preventDefault();
            });

            $elemento.on('pointermove', function (event) {
                const pointerEvent = event.originalEvent;

                if (!elemento.hasPointerCapture(pointerEvent.pointerId)) {
                    return;
                }

                $elemento.css({
                    left: pointerEvent.clientX - offsetX,
                    top: pointerEvent.clientY - offsetY
                });
            });

            $elemento.on('pointerup pointercancel', function (event) {
                const pointerEvent = event.originalEvent;

                if (elemento.hasPointerCapture(pointerEvent.pointerId)) {
                    elemento.releasePointerCapture(pointerEvent.pointerId);
                }
            });
        });
    }

    prepararArrastrables();

    function cargarIframe($canal) {
        const $iframe = $canal.find('iframe[data-src]');

        if ($iframe.length && !$iframe.attr('src')) {
            $iframe.attr('src', $iframe.data('src'));
        }
    }

    function cancelarCambioCanal() {
        window.clearTimeout(cambioPendiente);
        window.clearTimeout(quitarRuidoPendiente);
        $('#pantalla').removeClass('cambiando');
    }

    function cambiarConRuido(callback) {
        const $pantalla = $('#pantalla');

        cancelarCambioCanal();
        $pantalla.addClass('cambiando');

        cambioPendiente = window.setTimeout(function () {
            callback();
        }, 760);

        quitarRuidoPendiente = window.setTimeout(function () {
            $pantalla.removeClass('cambiando');
        }, 930);
    }

    function mostrarCanal(indice) {
        if ($('#apagado').hasClass('actual')) {
            return;
        }

        canalActual = (indice + canales.length) % canales.length;
        ultimoCanalEncendido = canalActual;

        const $canal = $(canales[canalActual]);

        cargarIframe($canal);

        cambiarConRuido(function () {
            ocultarCanal($('.canal.actual'));
            activarCanal($canal);
        });
    }

    $('#botonEncender').click(function () {
        const $apagado = $('#apagado');

        if ($apagado.hasClass('actual')) {
            ocultarCanal($apagado);

            const $canal = $(canales[ultimoCanalEncendido]);

            canalActual = ultimoCanalEncendido;
            cargarIframe($canal);
            cambiarConRuido(function () {
                activarCanal($canal);
            });

            return;
        }

        cancelarCambioCanal();
        ocultarCanal($('.canal.actual'));
        activarCanal($apagado);
    });

    $('#cambiaCanal').mousedown(function (event) {
        event.preventDefault();

        switch (event.which) {
            case 1:
                mostrarCanal(canalActual + 1);
                break;
            case 3:
                mostrarCanal(canalActual - 1);
                break;
            default:
                break;
        }
    });

    let volIni = 2;

    $('#cambiaVolumen').mousedown(function (event) {
        event.preventDefault();

        switch (event.which) {
            case 1:
                switch (volIni) {
                    case 0:
                        $('#volumen').toggleClass('fa-volume-xmark');
                        $('#volumen').toggleClass('fa-volume-off');
                        break;
                    case 1:
                        $('#volumen').toggleClass('fa-volume-off');
                        $('#volumen').toggleClass('fa-volume-low');
                        break;
                    case 2:
                        $('#volumen').toggleClass('fa-volume-low');
                        $('#volumen').toggleClass('fa-volume-high');
                        break;
                    default:
                        break;
                }
                if (volIni < 3) {
                    volIni++;
                }
                break;
            case 3:
                switch (volIni) {
                    case 1:
                        $('#volumen').toggleClass('fa-volume-xmark');
                        $('#volumen').toggleClass('fa-volume-off');
                        break;
                    case 2:
                        $('#volumen').toggleClass('fa-volume-off');
                        $('#volumen').toggleClass('fa-volume-low');
                        break;
                    case 3:
                        $('#volumen').toggleClass('fa-volume-low');
                        $('#volumen').toggleClass('fa-volume-high');
                        break;
                    default:
                        break;
                }
                if (volIni > 0) {
                    volIni--;
                }
                break;
            default:
                break;
        }
    });
});
