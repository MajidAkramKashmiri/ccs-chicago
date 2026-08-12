/* ==========================================================================
   Commercial Cleaning Systems of Chicago — site behaviour
   Everything here is progressive enhancement. With JS blocked the pages still
   read, the nav still links, and the form still posts.
   ========================================================================== */
(function () {
    'use strict';

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ----- footer year --------------------------------------------------- */
    Array.prototype.forEach.call(document.querySelectorAll('[data-year]'), function (el) {
        el.textContent = String(new Date().getFullYear());
    });

    /* ----- sticky header shadow ------------------------------------------ */
    var headerEl = document.querySelector('.site-header');
    if (headerEl) {
        var onScroll = function () {
            headerEl.classList.toggle('is-stuck', window.scrollY > 8);
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    /* ----- mobile nav ----------------------------------------------------- */
    var navToggle = document.querySelector('.nav-toggle');
    var nav = document.getElementById('site-nav');

    if (navToggle && nav) {
        navToggle.addEventListener('click', function () {
            var open = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', String(!open));
            nav.classList.toggle('is-open', !open);
            document.body.style.overflow = !open ? 'hidden' : '';
            navToggle.setAttribute('aria-label', !open ? 'Close menu' : 'Menu');
            if (!open) {
                var firstNavLink = nav.querySelector('a, button');
                if (firstNavLink) {
                    firstNavLink.focus();
                }
            }
        });
    }

    /* ----- service explorer tabs ---------------------------------------- */
    Array.prototype.forEach.call(document.querySelectorAll('[data-service-explorer]'), function (explorer) {
        var tabs = Array.prototype.slice.call(explorer.querySelectorAll('[role="tab"]'));
        var activate = function (tab) {
            tabs.forEach(function (item) {
                var selected = item === tab;
                item.setAttribute('aria-selected', String(selected));
                item.tabIndex = selected ? 0 : -1;
                var panel = document.getElementById(item.getAttribute('aria-controls'));
                if (panel) panel.hidden = !selected;
            });
        };
        tabs.forEach(function (tab, index) {
            tab.addEventListener('click', function () { activate(tab); });
            tab.addEventListener('keydown', function (event) {
                if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft' && event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
                event.preventDefault();
                var forward = event.key === 'ArrowRight' || event.key === 'ArrowDown';
                var next = tabs[(index + (forward ? 1 : -1) + tabs.length) % tabs.length];
                activate(next);
                next.focus();
            });
        });
    });

    /* ----- dropdown menus -------------------------------------------------
       On a hover-driven nav the menu is already open by the time a mouse click
       lands, so a plain toggle would close it — and with the pointer still
       inside, hover cannot reopen it. A mouse click therefore only ever opens;
       keyboard activation still toggles both ways.
       --------------------------------------------------------------------- */
    var dropdowns = Array.prototype.slice.call(document.querySelectorAll('.nav__item'));
    var hoverNav = window.matchMedia('(hover: hover) and (min-width: 1141px)');

    function closeDropdowns(except) {
        dropdowns.forEach(function (item) {
            if (item === except) {
                return;
            }
            item.classList.remove('is-open');
            var btn = item.querySelector('.nav__toggle');
            if (btn) {
                btn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    dropdowns.forEach(function (item) {
        var btn = item.querySelector('.nav__toggle');
        if (!btn) {
            return;
        }

        var closeTimer = null;

        var open = function () {
            window.clearTimeout(closeTimer);
            closeDropdowns(item);
            item.classList.add('is-open');
            btn.setAttribute('aria-expanded', 'true');
        };

        var close = function () {
            window.clearTimeout(closeTimer);
            item.classList.remove('is-open');
            btn.setAttribute('aria-expanded', 'false');
        };

        btn.addEventListener('click', function (event) {
            event.preventDefault();
            var fromKeyboard = event.detail === 0;

            if (hoverNav.matches && !fromKeyboard) {
                open();
                return;
            }
            if (item.classList.contains('is-open')) {
                close();
            } else {
                open();
            }
        });

        item.addEventListener('mouseenter', function () {
            if (hoverNav.matches) {
                open();
            }
        });

        item.addEventListener('mouseleave', function () {
            if (!hoverNav.matches) {
                return;
            }
            // Grace period so clipping a corner on the way to the panel does
            // not shut the menu.
            window.clearTimeout(closeTimer);
            closeTimer = window.setTimeout(close, 260);
        });

        item.addEventListener('focusout', function (event) {
            if (!item.contains(event.relatedTarget)) {
                close();
            }
        });
    });

    document.addEventListener('click', function (event) {
        if (!event.target.closest('.nav__item')) {
            closeDropdowns(null);
        }
    });

    document.addEventListener('keydown', function (event) {
        if (event.key !== 'Escape') {
            return;
        }
        closeDropdowns(null);
        if (nav && nav.classList.contains('is-open')) {
            nav.classList.remove('is-open');
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
            navToggle.focus();
        }
    });

    /* ----- rotating headline noun -----------------------------------------
       Cycles "office towers / warehouses / plants / …" in the hero. The first
       word is already in the markup, so with JS off the headline still reads
       as a finished sentence.
       --------------------------------------------------------------------- */
    var rotor = document.querySelector('[data-rotate]');

    if (rotor && !reduceMotion) {
        var words = [];
        try {
            words = JSON.parse(rotor.getAttribute('data-rotate')) || [];
        } catch (err) {
            words = [];
        }

        if (words.length > 1) {
            // Reserve the width of the longest word so the line never jumps.
            var measure = document.createElement('span');
            measure.className = 'hero__rot-word';
            measure.style.cssText = 'position:absolute;visibility:hidden;opacity:0';
            rotor.appendChild(measure);
            var widest = 0;
            words.forEach(function (w) {
                measure.textContent = w;
                widest = Math.max(widest, measure.getBoundingClientRect().width);
            });
            rotor.removeChild(measure);
            if (widest) {
                rotor.style.minWidth = Math.ceil(widest) + 'px';
            }

            var current = rotor.querySelector('.hero__rot-word');
            var at = 0;
            var rotorTimer = null;

            var advance = function () {
                at = (at + 1) % words.length;

                var next = document.createElement('span');
                next.className = 'hero__rot-word';
                next.textContent = words[at];
                rotor.appendChild(next);

                // Force a frame so the entry transition actually runs.
                void next.offsetWidth;
                next.classList.add('is-in');

                var leaving = current;
                leaving.classList.remove('is-in');
                leaving.classList.add('is-out');
                window.setTimeout(function () {
                    if (leaving.parentNode) {
                        leaving.parentNode.removeChild(leaving);
                    }
                }, 600);

                current = next;
            };

            var startRotor = function () {
                window.clearInterval(rotorTimer);
                rotorTimer = window.setInterval(advance, 2200);
            };

            document.addEventListener('visibilitychange', function () {
                if (document.hidden) {
                    window.clearInterval(rotorTimer);
                } else {
                    startRotor();
                }
            });

            startRotor();
        }
    }

    /* ----- hero parallax ---------------------------------------------------
       The background drifts slower than the page scrolls, and leans a few
       pixels toward the pointer. Both are clamped small deliberately: parallax
       reads as depth when it is barely noticed and as a gimmick when it is not.
       Everything runs off one rAF frame so scrolling stays smooth.
       --------------------------------------------------------------------- */
    var parallaxEl = document.querySelector('[data-parallax]');

    if (parallaxEl && !reduceMotion && window.matchMedia('(min-width: 760px)').matches) {
        var heroEl = parallaxEl.closest('.hero');
        var scrollShift = 0;
        var pointerX = 0;
        var pointerY = 0;
        var queued = false;
        var inView = true;

        var paint = function () {
            queued = false;
            parallaxEl.style.transform =
                'translate3d(' + pointerX.toFixed(2) + 'px, ' + (scrollShift + pointerY).toFixed(2) + 'px, 0)';
        };

        var request = function () {
            if (!queued && inView) {
                queued = true;
                window.requestAnimationFrame(paint);
            }
        };

        window.addEventListener(
            'scroll',
            function () {
                // Max ~70px of travel across the hero's height.
                var y = window.scrollY;
                var h = heroEl.offsetHeight || 1;
                scrollShift = Math.max(-70, Math.min(0, -(y / h) * 70));
                request();
            },
            { passive: true }
        );

        heroEl.addEventListener(
            'mousemove',
            function (event) {
                var r = heroEl.getBoundingClientRect();
                pointerX = ((event.clientX - r.left) / r.width - 0.5) * -16;
                pointerY = ((event.clientY - r.top) / r.height - 0.5) * -10;
                request();
            },
            { passive: true }
        );

        heroEl.addEventListener('mouseleave', function () {
            pointerX = 0;
            pointerY = 0;
            request();
        });

        // Stop touching the DOM once the hero has scrolled away.
        if ('IntersectionObserver' in window) {
            new IntersectionObserver(function (entries) {
                inView = entries[0].isIntersecting;
            }).observe(heroEl);
        }
    }

    /* ----- FAQ accordion --------------------------------------------------- */
    Array.prototype.forEach.call(document.querySelectorAll('.faq__q'), function (btn) {
        btn.addEventListener('click', function () {
            var open = btn.getAttribute('aria-expanded') === 'true';
            var panel = document.getElementById(btn.getAttribute('aria-controls'));
            btn.setAttribute('aria-expanded', String(!open));
            if (panel) {
                panel.hidden = open;
            }
        });
    });

    /* ----- stat count-up ---------------------------------------------------
       Counts from zero when the band scrolls into view. The final value is in
       the markup, so a browser without JS or with motion reduced simply shows
       the number.
       --------------------------------------------------------------------- */
    var counters = Array.prototype.slice.call(document.querySelectorAll('[data-count]'));

    function settle(el) {
        el.textContent = el.getAttribute('data-count') + (el.getAttribute('data-suffix') || '');
    }

    if (counters.length) {
        if (reduceMotion || !('IntersectionObserver' in window)) {
            counters.forEach(settle);
        } else {
            var countObserver = new IntersectionObserver(
                function (entries) {
                    entries.forEach(function (entry) {
                        if (!entry.isIntersecting) {
                            return;
                        }
                        var el = entry.target;
                        countObserver.unobserve(el);

                        var target = parseFloat(el.getAttribute('data-count')) || 0;
                        var suffix = el.getAttribute('data-suffix') || '';
                        var duration = 1100;
                        var started = null;

                        // Markup ships the final figure so a no-JS visitor sees
                        // real numbers; zero it only now, as the count begins.
                        el.textContent = '0' + suffix;

                        var step = function (now) {
                            if (started === null) {
                                started = now;
                            }
                            var p = Math.min((now - started) / duration, 1);
                            // ease-out cubic
                            var eased = 1 - Math.pow(1 - p, 3);
                            el.textContent = Math.round(target * eased) + suffix;
                            if (p < 1) {
                                window.requestAnimationFrame(step);
                            } else {
                                settle(el);
                            }
                        };
                        window.requestAnimationFrame(step);
                    });
                },
                { threshold: 0.4 }
            );
            counters.forEach(function (el) {
                countObserver.observe(el);
            });
        }
    }

    /* ----- reveal on scroll ------------------------------------------------ */
    var revealables = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));

    if (!revealables.length) {
        // nothing to do
    } else if (reduceMotion || !('IntersectionObserver' in window)) {
        revealables.forEach(function (el) {
            el.classList.add('is-in');
        });
    } else {
        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-in');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
        );
        revealables.forEach(function (el) {
            observer.observe(el);
        });

        // Safety net: reveal-on-scroll hides content until the observer fires.
        // If nothing has fired a few seconds in, show everything rather than
        // leaving an empty page.
        window.setTimeout(function () {
            if (!document.querySelector('[data-reveal].is-in')) {
                revealables.forEach(function (el) {
                    el.classList.add('is-in');
                });
            }
        }, 2500);
    }

    /* ----- quote form ------------------------------------------------------ */
    var form = document.getElementById('quote-form');

    if (form) {
        var status = form.querySelector('[data-form-status]');
        var key = form.getAttribute('data-access-key');
        var connected = key && key.indexOf('REPLACE_WITH') !== 0;

        // Preselect a service when arriving from a "get a price for X" link.
        var wanted = new URLSearchParams(window.location.search).get('service');
        if (wanted) {
            var select = form.querySelector('#qf-service');
            var slugify = function (text) {
                return text
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-|-$/g, '');
            };
            Array.prototype.forEach.call(select ? select.options : [], function (option) {
                if (option.value && slugify(option.value) === wanted) {
                    select.value = option.value;
                }
            });
        }

        var setError = function (field, message) {
            var wrap = field.closest('.field');
            if (!wrap) {
                return;
            }
            var slot = wrap.querySelector('[data-error]');
            if (slot && !slot.id) {
                slot.id = field.id + '-error';
                field.setAttribute('aria-describedby', slot.id);
            }
            wrap.classList.toggle('is-invalid', Boolean(message));
            if (slot) {
                slot.textContent = message || '';
            }
            if (message) {
                field.setAttribute('aria-invalid', 'true');
            } else {
                field.removeAttribute('aria-invalid');
            }
        };

        var validateField = function (field) {
            var value = (field.value || '').trim();

            if (field.hasAttribute('required') && !value) {
                setError(field, 'This one is needed.');
                return false;
            }
            if (field.type === 'tel' && value && value.replace(/[^0-9]/g, '').length < 7) {
                setError(field, 'That does not look like a full phone number.');
                return false;
            }
            if (field.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
                setError(field, 'Check the email address.');
                return false;
            }
            setError(field, '');
            return true;
        };

        var fields = Array.prototype.slice.call(form.querySelectorAll('input, select, textarea')).filter(function (f) {
            return f.type !== 'hidden' && !f.classList.contains('hp');
        });

        fields.forEach(function (field) {
            field.addEventListener('blur', function () {
                validateField(field);
            });
            field.addEventListener('input', function () {
                var wrap = field.closest('.field');
                if (wrap && wrap.classList.contains('is-invalid')) {
                    validateField(field);
                }
            });
        });

        var say = function (message, kind) {
            if (!status) {
                return;
            }
            status.textContent = message;
            status.className = 'form-status is-visible ' + (kind === 'ok' ? 'is-ok' : 'is-error');
        };

        form.addEventListener('submit', function (event) {
            event.preventDefault();

            var ok = true;
            var firstBad = null;
            fields.forEach(function (field) {
                if (!validateField(field)) {
                    ok = false;
                    if (!firstBad) {
                        firstBad = field;
                    }
                }
            });

            if (!ok) {
                say('A couple of fields still need attention.', 'error');
                if (firstBad) {
                    firstBad.focus();
                }
                return;
            }

            var hp = form.querySelector('.hp');
            if (hp && hp.checked) {
                return; // silently drop bots
            }

            if (!connected) {
                say(
                    'This form is not connected to an inbox yet. Please call us instead — the number is at the top of ' +
                        'the page — and we will pick it up straight away.',
                    'error'
                );
                return;
            }

            var button = form.querySelector('button[type="submit"]');
            var original = button ? button.innerHTML : '';
            if (button) {
                button.disabled = true;
                button.textContent = 'Sending…';
            }

            fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { Accept: 'application/json' }
            })
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    if (data && data.success) {
                        form.reset();
                        say('Thanks — that is with us. We will come back to you within one working day.', 'ok');
                    } else {
                        say('That did not send. Please call us instead and we will sort it out on the spot.', 'error');
                    }
                })
                .catch(function () {
                    say('That did not send — the connection dropped. Please call and we will take the details.', 'error');
                })
                .then(function () {
                    if (button) {
                        button.disabled = false;
                        button.innerHTML = original;
                    }
                });
        });
    }
})();
