define(['jquery'], function($) {
    'use strict';

    var base = function() {
        var $public = {};
        var $private = {};
        var $parent = {};
        var $initMenu = false;


        $public.init = function init(_parent) {
            $parent = _parent;
        };

        $public.create = function create(complete) {

            $(".main").append("<div class='base'></div>");
            $(".base").load("views/interface/base/index.html", function() {

                //
                $private.createTelasContainer();
                $private.controleNavBase();
                $private.createEventosMenu();

                complete();
            });


        };

        $public.liberarNavegacao = function liberarNavegacao() {

            var page = $parent.config[$parent.indice];
            var id = String(page.id).toUpperCase();
            var _container = $(".container" + id);

            _container.find(".setaDirBase").css("display", 'none');

            if (page.setas == 'nenhuma' || page.setas == 'nenhum') {
                _container.find(".setaDirBase").css("display", 'none');
                _container.find(".setaEsqBase").css("display", 'none');
                return false;
            }

            var element = _container.find(".setaDirBase .icoSet");
            element.on('animationend', function() {
                element.removeClass("fadeIn");
                element.addClass("infinite pulse");
            })

            $parent.liberado = true;

            if (page.setas == 'esquerda') {
                _container.find(".setaDirBase").css("display", 'none');
                _container.find(".setaEsqBase").css("display", 'block');
            }

            if (page.setas == 'direita') {
                _container.find(".setaDirBase").css("display", 'block');
                _container.find(".setaEsqBase").css("display", 'none');
            }

            if (page.setas == 'ambas') {
                _container.find(".setaDirBase").css("display", 'block');
                _container.find(".setaEsqBase").css("display", 'block');
            }
        }


        $private.liberarNext = function liberarNext() {


            var page = $parent.config[$parent.indice];
            var id = String(page.id).toUpperCase();
            var _container = $(".container" + id);
            _container.find(".setaDirBase").css("display", 'none');

            if (page.setas == 'nenhuma' || page.setas == 'nenhum') {
                _container.find(".setaDirBase").css("display", 'none');
                _container.find(".setaEsqBase").css("display", 'none');
                return false;
            }

            var _avaliada = -1;
            if ($parent.scorm_get_suspendData("av")) {
                var _avArray = $parent.scorm_get_suspendData("av").split('_');

                if (parseInt(_avArray[0]) > parseInt($parent.indice)) {
                    _avaliada = 1;
                } else {
                    _avaliada = parseInt(_avArray[1]);
                }
            }


            if (_avaliada < 0) {
                return false;
            }


            var element = _container.find(".setaDirBase .icoSet");
            element.on('animationend', function() {
                element.removeClass("fadeIn");
                element.addClass("infinite pulse");
            })

            $parent.liberado = true;

            var _indice = $parent.indice;
            var _config = $parent.config;
            $.each(_config, function(index, value) {
                if (_indice == value.indice) {
                    value.visivel = true;
                }
            });


            if (page.setas == 'esquerda') {
                _container.find(".setaDirBase").css("display", 'none');
                _container.find(".setaEsqBase").css("display", 'block');
            }

            if (page.setas == 'direita') {
                _container.find(".setaDirBase").css("display", 'block');
                _container.find(".setaEsqBase").css("display", 'none');
            }

            if (page.setas == 'ambas') {
                _container.find(".setaDirBase").css("display", 'block');
                _container.find(".setaEsqBase").css("display", 'block');
            }
        }

        $public.sair = function sair() {
            //$(".sairContainer").css("display", "block");
            $private.sairCurso();
        }

        $private.createTelasContainer = function createTelasContainer() {
            var _config = $parent.config;

            $.each(_config, function(index, value) {
                $(".telaBase").append("<div indice=" + value.indice + " id=" + value.id + " avancar=" + value.avancar + "  carregado=" + value.carregado + " setas=" + value.setas + " tipo=" + value.tipo + " transicao=" + value.transicao + "  class='telaContainer telaContainer" + value.indice + "'></div>");
            })
        }

        $private.controleNavBase = function controleNavBase() {

            $("body").on('navegacaoComplete', function() {
                var _indice = $parent.indice;
                var _config = $parent.config;

                $.each(_config, function(index, value) {
                    if ($parent.indice == value.indice) {

                        $private.liberarMenu(index, value, _indice, _config);
                        $private.destravarStatus(index, value, _indice, _config);
                        $private.createCustom();
                        $private.resetAnimate();
                    }
                })

                //
                var _heightTop = parseInt($('.topBase').css("height"));
                $('.telaBase').css("height", window.innerHeight - _heightTop);

            });

        }

        $private.resetAnimate = function resetAnimate() {

            var page = $parent.config[$parent.indice];
            var id = String(page.id).toUpperCase();
            var _containerTela = $(".container" + id);

            if (window[page.id].status) {
                _containerTela.find(".animated").each(function(indice, item) {

                    if ($(item).css("display") == "block" || $(item).css("display") == "flex") {
                        $(item).removeClass("animated");
                    }

                });

                var slideContainer = _containerTela.find('.slide-container');
                slideContainer.slick('slickGoTo', 0);

            }

        }
        $private.liberarMenu = function liberarMenu(index, value, _indice, _config) {

            setTimeout(function() {

                var page = $parent.config[$parent.indice];
                var id = String(page.id).toUpperCase();
                var _containerTela = $(".container" + id);

                var _tela = _containerTela.find('.btnMenu').attr('tela');
                var _indiceMenu = 0;

                $.each($parent.config, function(indice, item) {

                    if (String(item.id).toUpperCase() == String(_tela).toUpperCase()) {
                        _indiceMenu = item.indice;
                    }
                });


                if (parseInt($parent.indice) > _indiceMenu) ///Acima da tela do Satelite ele libera o btn Menu
                {

                    _containerTela.find('.btnMenu').css('display', 'block');
                    _containerTela.find('.btnFaq').css('display', 'block');


                } else {
                    _containerTela.find('.btnMenu').css('display', 'none');
                    _containerTela.find('.btnFaq').css('display', 'none');
                }

            }, 1000 * 1);

        }

        $private.destravarStatus = function destravarStatus(index, value, _indice, _config) {

            if (parseInt(value.avancar) > -1) {
                setTimeout(function() {

                    $private.liberarNext();

                }, 1000 * value.avancar);
            }
        }

        $private.createCustom = function createCustom() {
            var page = $parent.config[$parent.indice];
            var id = String(page.id).toUpperCase();
            var _custom = page.custom;
            var _container = $(".container" + id);

            if (!_container.find(".baseCustom").attr('interface')) {
                page.custom = 1;
                _container.append("<div class='faqCustom'></div>");
                _container.find(".faqCustom").load("views/interface/faq/index.html", function() {
                    _container.prepend("<div class='baseCustom'></div>");
                    _container.find(".baseCustom").load("views/interface/custom/index.html", function() {
                        _container.find(".baseCustom").attr('interface', 1);
                        $private.controleCustom();
                        $private.verificarStatusSetas();
                        $private.verificarConteudo();
                    });
                });


            } else {
                $private.verificarConteudo();
            }
        }

        $private.controleCustom = function controleCustom() {

            var page = $parent.config[$parent.indice];
            var id = String(page.id).toUpperCase();
            var _container = $(".container" + id);

            _container.find(".posicionar").positionCSS({
                img_H: course.height,
                img_W: course.width
            });

            _container.find(".voltar").on('click', function() {

                $parent.indice = 0;
                $("body").attr("nav", "go");
                $("body").trigger("navegacao");
            });


            $(".navInit").css("display", "block");

            _container.find(".setaEsqBase").on('click', function() {
                $("body").attr("nav", "previous");
                $("body").trigger("navegacao");
            })

            _container.find(".setaDirBase").on('click', function() {

                // if ($parent.liberado) {
                $("body").attr("nav", "next");
                $("body").trigger("navegacao");
                // }
            })

            _container.find(".btnMenu").on('click', function() {

                var _tela = $(this).attr('tela');
                var _indice = 0;

                $.each($parent.config, function(indice, item) {

                    if (String(item.id).toUpperCase() == String(_tela).toUpperCase()) {
                        _indice = item.indice;
                    }
                });

                $parent.indice = _indice;
                $("body").attr("nav", "go");
                $("body").trigger("navegacao");

            })

            _container.find(".btnFaq").on('click', function() {
                _container.find(".faq").css('display', 'block');
                _container.find(".faq .step").css('display', 'none');

                var page = $parent.config[$parent.indice];
                var titulo = page.parentNivel2.titulo;

                _container.find(".faq ." + titulo + "FAQ").css('display', 'block');

                setTimeout(function() {
                    _container.find(".faq .faqBase").animate({ scrollTop: 3000 }, 500 * 1, 'swing', function() {
                        _container.find(".faq .faqBase").animate({ scrollTop: 0 }, 300 * 1);
                    });
                }, 1000 * 1)

            });

            _container.find(".closeFAQ").on('click', function() {
                _container.find(".faq").css('display', 'none');
            });

            if ($parent.ieOLD) {
                setTimeout(function() {
                    _container.find('.cartao').each(function(indice, item) {
                        $(item).removeClass('animated zoomIn');
                    });
                }, 1000 * 3);
            }


            _container.find('.cartao').each(function(indice, item) {

                $(item).addClass('cartaoInativo');

                $.each($parent.config, function(indiceC, itemC) {

                    if ((itemC.id).toUpperCase() == id.toUpperCase()) {

                        $.each(itemC.cartoes, function(ind, itemX) {
                            if ($(item).hasClass('cartao' + itemX)) {
                                $(item).removeClass('cartaoInativo');
                            }
                        });
                    }
                });
            });


        }



        $private.verificarStatusSetas = function verificarStatusSetas() {

            var page = $parent.config[$parent.indice];
            var id = String(page.id).toUpperCase();
            var _container = $(".container" + id);

            _container.find(".setaDirBase").css("display", "none");

            if (page.setas == "direita") {
                _container.find(".setaEsqBase").css("display", "none");
                _container.find(".setaDirBase").css("display", "block");
            } else if (page.setas == "esquerda") {
                _container.find(".setaEsqBase").css("display", "block");
                _container.find(".setaDirBase").css("display", "none");
            }


        }

        $private.verificarConteudo = function verificarConteudo() {
            var page = $parent.config[$parent.indice];
            var id = String(page.id).toUpperCase();
            var _container = $(".container" + id);

            if (page.setas == 'nenhuma' || page.setas == 'nenhum') {
                _container.find(".setaDirBase").css("display", 'none');
                _container.find(".setaEsqBase").css("display", 'none');
                return false;
            }


            var _titulo1 = page.parentNivel1.titulo;
            _container.find(".titulo1Base").text(_titulo1);

            //template 4
            _container.find(".pop").css('display', 'none');
        }


        $private.createEventosMenu = function createEventosMenu() {
            $private.createSair();
            $private.createRetormar();
        }


        $private.createRetormar = function createRetormar() {

            if (!$parent.retornar) /// confere se é para ter a tela de retornar de onde parou
                return false

            var _indice = $parent.indice;
            if (_indice != 0) {
                $(".retormar").css("display", "block");

                $(".retormar").find(".naoSair").on("click", function() {

                    $(".retormar").css("display", "none");


                    $parent.indice = 0;
                    $("body").attr("nav", "go");
                    $("body").trigger("navegacao");

                });

                $(".retormar").find(".simSair").on("click", function() {
                    $(".retormar").css("display", "none");
                });

            }
        }



        $private.createSair = function createSair() {

            $(".main").append("<div class='sairContainer'></div>");
            $(".sairContainer").load("views/interface/sair/sair.html", function() {
                $(".sairContainer .naoSair").on('click', function() {
                    $(".sairContainer").css("display", "none");
                })

                $(".sairContainer .simSair").on('click', function() {
                    $private.sairCurso();
                })

            });

            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                $(".iconSairBase").css("display", "block");
            }

            $(".iconSairBase").on('click', function() {
                $(".sairContainer").css("display", "block");
            })
        }

        $private.sairCurso = function sairCurso() {

            var _quit_url = "views/interface/sair/encerrado.html";

            if (top === window) { // IS IFRAME
                var Browser = navigator.appName;
                var indexB = Browser.indexOf('Explorer');

                if (indexB > 0) {
                    var indexV = navigator.userAgent.indexOf('MSIE') + 5;
                    var Version = navigator.userAgent.substring(indexV, indexV + 1);

                    if (Version >= 7) {
                        window.open('', '_self', '');
                        window.close();
                    } else if (Version == 6) {
                        window.opener = null;
                        window.close();
                    } else {
                        window.opener = '';
                        window.close();
                    }

                } else {
                    window.open('', '_parent', '');
                    window.close();
                }
            } else {
                var contentRoot = window;
                var urlBase = $private.GetContentRootUrlBase(contentRoot);
                window.location.href = urlBase + _quit_url;
            }

            $parent.sairScorm();
        }

        $private.GetContentRootUrlBase = function GetContentRootUrlBase(contentRoot) {

            var urlParts = contentRoot.location.href.split("/");
            delete urlParts[urlParts.length - 1];
            contentRoot = urlParts.join("/");
            return contentRoot;
        }


        return $public;
    };

    return base();
});