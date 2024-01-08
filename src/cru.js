const $cru = (el) => document.querySelector(el)
const $crus = (el) => document.querySelectorAll(el)
const $cruConfig = {
    'prefix_url': '', // '/api/v1',
    'headers': {'Content-Type': 'application/json'},
    'callbacks': {},
}


const $C = (config = false) => {

    if (config) {
        for (let key of Object.keys(config)) {
            $cruConfig[key] = config[key]
        }
    }

    $cruLoadEvents()
}

const $cruLoadEvents = () => {
    $cruLoadRequests()
    $cruLoadFormIntercept()
    $cruLoadAllContainers()
}

const $cruLoadContainer = async (el) => {
    el.classList.add('loaded')
    const container = el.closest('[c-container]') || el
    const url = container.getAttribute('c-container')
    const target = container.getAttribute('c-target') || false
    const type = container.getAttribute('c-type') || 'html'
    const callback = container.getAttribute('c-callback') || false
    // request
    const response = await fetch($cruConfig['prefix_url'] + url, {
        method: 'GET', 
        headers: $cruConfig['headers']
    })
    const content = await $cruTypeResponse(type, response)
    const $target = target ? $cru(target):container
    // callbacks
    if (callback) {
        $cruConfig['callbacks'][callback](content, $target)
    }
    else {
        if (target) $target.innerHTML = $cruHTML(content)
        else if (type == 'html') $target.innerHTML = $cruHTML(content)
    }

    $cruLoadEvents()
}
const $cruLoadAllContainers = async () => {

    $crus('[c-container]:not(.loaded)').forEach( async (el) => {
        el.classList.add('loaded')
        $cruLoadContainer(el)
    })
    $crus('[c-reload]:not(.loaded)').forEach( async (el) => {
        el.classList.add('loaded')
        el.addEventListener('click', (ev) => $cruLoadContainer(el))
    })
}

const cruRequest = async (el, method) => {
    const url = el.getAttribute(`c-${method}`)
    const type = el.getAttribute('c-type') || 'html'
    const reloadContainer = el.getAttribute('c-reload-container') || false;
    const removeClosest = el.getAttribute('c-remove-closest') || false
    const swap = el.getAttribute('c-swap') || false;
    const callback = el.getAttribute('c-callback') || false
    const target = el.getAttribute('c-target') || false;
    // request
    const response = await fetch($cruConfig['prefix_url'] + url, {
        method: method, 
        headers: $cruConfig['headers']
    })
    const content = await $cruTypeResponse(type, response)
    const $target = target ? $cru(target):false
    // callbacks
    if (removeClosest) el.closest(removeClosest).remove()
    if (swap) $cru(swap).outerHTML = content
    if (reloadContainer) $cruLoadContainer(el)
    if (callback) $cruConfig['callbacks'][callback](content, $target)
    else {
        if ($target) {
            $target.innerHTML = $cruHTML(content)
        } else if (type == 'html') {
            el.innerHTML = $cruHTML(content)
        }
    }
    $cruLoadEvents()
}

const $cruLoadRequests = () => {
    $crus('[c-delete]:not(.loaded)').forEach( (el) => {
        el.classList.add('loaded')
        el.addEventListener('click', async (e) => {
            cruRequest(el, 'delete')
        })
    })
    $crus('[c-put]:not(.loaded)').forEach( (el) => {
        el.classList.add('loaded')
        el.addEventListener('click', async (e) => {
            cruRequest(el, 'put')
        })
    })
    $crus('[c-get]:not(.loaded)').forEach( (el) => {
        el.classList.add('loaded')
        el.addEventListener('click', async (e) => {
            cruRequest(el, 'get')
        })
    })
    $crus('[c-post]:not(.loaded)').forEach( (el) => {
        el.classList.add('loaded')
        el.addEventListener('click', async (e) => {
            cruRequest(el, 'post')
        })
    })
}

const $cruLoadFormIntercept = () => {
    $crus('.c-form:not(.loaded)').forEach((form) => {
        form.classList.add('loaded')
        form.addEventListener('submit', async (e) => {
            e.preventDefault()
            const url = form.getAttribute('action')
            const method = form.getAttribute('method').toUpperCase() || 'POST'
            const type = form.getAttribute('c-type') || 'html';
            const append = form.getAttribute('c-append') || false;
            const swap = form.getAttribute('c-swap') || false;
            const target = form.getAttribute('c-target') || false;
            const reloadContainer = form.getAttribute('c-reload-container') || false;
            const callback = form.getAttribute('c-callback') || false
            const isRead = $cruIsRead(method)
            // load data from form
            const data = Object.fromEntries(new FormData(e.target).entries());
            // request
            const url_formatted = cruFormatURL(url, isRead, data)

            const response = await fetch(url_formatted, {
                method: method,
                headers: $cruConfig['headers'],
                body: isRead ? null:JSON.stringify(data)
            })
            const content = await $cruTypeResponse(type, response)
            // callbacks
            if (swap) $cru(swap).outerHTML = $cruHTML(content)
            if (append) $cru(append).insertAdjacentHTML('beforeend', content)
            if (target) $cru(target).innerHTML = $cruHTML(content)
            if (reloadContainer) {
                $cruLoadContainer(form)
            }
            if (callback) $cruConfig['callbacks'][callback](content, form)
            $cruLoadEvents()
        })
    })
}

// utils
const cruFormatURL = (url, isRead, data) => {
    let url_format = $cruConfig['prefix_url'] + url
    if (isRead) {
        try {
            url_format = new URL(url)
        } catch(e) {
            try { url_format = new URL(window.location.origin + url) }
            catch(e) { throw("Wrong URL: ", url)}
        } finally {
            url_format.search = new URLSearchParams(data).toString();
            url_format = url_format.href
        }
    }
    return url_format
}

const $cruCallback = (name, callback) => {
    $cruConfig['callbacks'][name] = callback
}
const $cruHTML = (html) => {
    const tempDiv = document.createElement('span');
    tempDiv.innerHTML = html;
    const script = tempDiv.querySelector('script');
    let htmlSemScript = tempDiv.innerHTML
    if (script) {
        htmlSemScript = htmlSemScript.replace(script.outerHTML, '');
        eval(script.textContent);
    }
    return htmlSemScript;
}
const $cruIsRead = (method) => ['GET', 'HEAD'].includes(method)
const $cruTypeResponse = async (type, response) => 
    type == 'html' ? await response.text():await response.json()

$C()