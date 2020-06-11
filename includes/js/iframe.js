define(['jquery', 'jquery_scorm'], function($) {

    'use strict';

    var iframe = function() {
        var $public = {};
        var $private = {};

        //=============================================================
        // VARIABLES
        //=============================================================

        $private.projectData = {};
        $private.componenteData = {};

        $public.PATH_CONFIG = "";
        $public.indice = 0;
        $public.indiceOLD = 0;
        $public.config = [];
        $public.liberado = false;
        $public.block = true;
        $public.retornar = false;
        $public.resize = false;
        $public.body = $("body");
        $public.padraoALL = 0;



        //=============================================================
        // PUBLIC FUNCTIONS
        //=============================================================  

        $public.init = function init(PATH_CONFIG) {

            $public.PATH_CONFIG = PATH_CONFIG;
            $private.initScorm();

        };

        $public.preloaderInit = function preloaderInit() {
            document.getElementById("loading").style.display = "block";
        }

        $public.preloaderComplete = function preloaderComplete() {
            document.getElementById("loading").style.display = "none";
        }

        $public.setComponente = function setComponente(pathName, pathData) {
            $private.componenteData[pathName] = pathData;
        };

        $public.getComponente = function getComponente(pathName) {
            return $private.componenteData[pathName];
        };

        $public.setCourse = function setCourse(pathName, pathData) {
            $private.projectData[pathName] = pathData;
            return $public;
        };

        $public.getCourse = function getCourse(pathName) {
            return $private.projectData[pathName];
        };
        /*
            SCORM
        */
        $public.scorm_start = function scorm_start(cache) {
            $public.getComponente("scorm").scormInit(cache);
        }

        $public.scorm_get_suspendData = function scorm_get_suspendData(variable) {
            return $public.getComponente("scorm").getSuspendata(variable);
        }

        $public.scorm_set_suspendData = function scorm_set_suspendData(variable, value) {
            $public.getComponente("scorm").setSuspendata(variable, value);
        }

        $public.scorm_get_lessonLocation = function scorm_get_lessonLocation(variable) {
            return $public.getComponente("scorm").getLessonLocation(variable);
        }

        $public.scorm_set_lessonLocation = function scorm_set_lessonLocation(variable, value) {
            $public.getComponente("scorm").setLessonLocation(variable, value);
        }

        $public.scorm_set_score = function scorm_set_score(raw) {
            $public.getComponente("scorm").setScore(raw);
        }

        $public.scorm_get_score = function scorm_get_score() {
            return $public.getComponente("scorm").getScore();
        }

        $public.scorm_set_interactions = function scorm_set_interactions(indice, correto, resposta, tipo, tempoGasto, pesoDado) {
            $public.getComponente("scorm").setInteractions(indice, correto, resposta, tipo, tempoGasto, pesoDado); //_indice, correto, resposta, _tipo, _tempoGasto, _pesoDado
        }

        $public.scorm_set_status_lesson = function scorm_set_status_lesson(_status) {
            $public.getComponente("scorm").setStatusLesson(_status)
        }

        $public.scorm_get_status_lesson = function scorm_get_status_lesson() {
            return $public.getComponente("scorm").getStatusLesson()
        }

        $public.scorm_get_interactions_count = function scorm_get_interactions_count() {
            return $public.getComponente("scorm").getInteractionsCount();
        }

        $public.scorm_reset = function scorm_reset() {
            $public.getComponente("scorm").resetAll();
        }

        $public.scorm_reset_suspendData = function scorm_reset_suspendData() {
            $public.getComponente("scorm").resetSuspendata();
        }

        $public.scorm_reset_lessonLocation = function scorm_reset_lessonLocation() {
            $public.getComponente("scorm").resetLessonLocation();
        }

        $public.scorm_quit = function scorm_quit() {
            $public.getComponente("scorm").sairScorm();
        }

        $public.scorm_complete = function scorm_complete() {
            $public.getComponente("scorm").completeScorm();
        }

        //=============================================================
        // CONTROLES
        //=============================================================    


        //////////////////////////////// 
        //       SCORM                //
        ////////////////////////////////


        $private.initScorm = function initScorm() {

            require(["iframe/vendor/scorm"], function(module) {
                module.init($public);
                module.create(function() {
                    $private.initXML();
                });

                $public.setComponente("scorm", module);
            });
        }

        //////////////////////////////// 
        //       INIT XML              //
        ////////////////////////////////

        $private.initXML = function initXML() {
            var _pathXML = $public.PATH_CONFIG;



            $.ajax({
                // a url do xml
                url: _pathXML,
                // o tipo de dados que é xml
                dataType: "xml",
                // antes de enviar loga "Enviando"
                beforeSend: function() {
                    //console.log('Enviando');
                },
                // se terminar com sucesso loga o retorno
                success: function(xml) {

                    $(xml).find('info').each(function() {
                        $public.width = Number($(this).find('width').text());
                        $public.height = Number($(this).find('height').text());

                        //
                        $private.initIframe();
                    });

                    $(xml).find('info').find('compilador').each(function() {
                        $public.resize = ($private.filtroResposta($(this).find('resize').text()));

                        if ($public.resize)
                            $private.resizeInit();
                    })

                }
            });

        }


        //////////////////////////////// 
        //       INIT IFRAME          //
        ////////////////////////////////

        $private.initIframe = function initIframe() {
            $private.dataInit();


            $(window).resize(function() {
                clearTimeout($.data(this, 'resizeTimer'));
                $.data(this, 'resizeTimer', setTimeout(function() {
                    $private.dataInit();
                }, 200));
            });
        };

        $private.resizeInit = function resizeInit() {
            window.moveTo(0, 0);
            window.resizeTo(screen.width, screen.height);

            top.window.moveTo(0, 0);
            if (document.all) {
                top.window.resizeTo(screen.availWidth, screen.availHeight);
            } else if (document.layers || document.getElementById) {
                if (top.window.outerHeight < screen.availHeight || top.window.outerWidth < screen.availWidth) {
                    top.window.outerHeight = screen.availHeight;
                    top.window.outerWidth = screen.availWidth;
                }
            }
        }

        $private.dataInit = function dataInit() {

            var _w = $public.width;
            var _h = $public.height;
            var _screenW = $(window).width();
            var _screenH = $(window).height();
            var $box = $('.containerIframe iframe');

            var scale = Math.min(
                _screenW / _w,
                _screenH / _h
            );

            $box.css("width", _w * scale);
            $box.css("height", _h * scale);


            $box.css("margin-left", (_w * scale) / 2 * -1);
            $box.css("margin-top", (_h * scale) / 2 * -1);

        }

        $private.filtroResposta = function filtroResposta(_resp) {
            var _termo = String(_resp);

            if (_termo == "sim" || _termo == "Sim" || _termo == "SIM" ||
                _termo == "true" || _termo == "True" || _termo == "TRUE" || _termo == true) {
                return true;
            } else {
                return false;
            }

        }




        return $public;
    };

    return iframe();
});