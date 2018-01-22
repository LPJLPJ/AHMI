(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS

        module.exports = factory()
    } else {
        // Browser globals
        window.spinner = factory();
    }
}(function () {
    var Spinner = {}

    var spinnerDOM = document.createElement('div')
    spinnerDOM.id = 'loading-wrapper'
    spinnerDOM.className = 'loading-wrapper'
    var indicatorDOM = document.createElement('div')
    indicatorDOM.className = 'indicator-wrapper'
    var imgDOM = document.createElement('img')
    imgDOM.className = 'loading rotating'
    imgDOM.src = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNi4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9ImNvZzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB3aWR0aD0iOTZweCIgaGVpZ2h0PSI5NnB4IiB2aWV3Qm94PSIwIDAgOTYgOTYiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDk2IDk2IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxnPg0KCTxnPg0KCQk8cGF0aCBmaWxsPSIjRkZGRkZGIiBkPSJNODcuMzExLDQ4YzAtMC45ODMtMC4wNzYtMS45NDctMC4xNDgtMi45MTJjMy44NC0xLjIyNyw2Ljg4LTIuMzk3LDguODM4LTMuNDQxbC0wLjcwNC0zLjk2Mw0KCQkJYy0yLjE5OC0wLjMxNi01LjQ1Ni0wLjM4NS05LjQ4MS0wLjIzNmMtMC41MzUtMS44OS0xLjIwMy0zLjcxOS0yLjAwNi01LjQ4YzMuMTc4LTIuNDUyLDUuNjI4LTQuNTgsNy4xMDUtNi4yMjVsLTIuMDI3LTMuNDg0DQoJCQljLTIuMTc2LDAuNDQ5LTUuMjYzLDEuNDkxLTguOTk3LDIuOTk4Yy0xLjE0OC0xLjU4Mi0yLjM5Ny0zLjA4NC0zLjc2Ny00LjQ3NmMyLjE0MS0zLjM4MSwzLjcwOS02LjIxMSw0LjUzLTguMjU3bC0zLjEwNi0yLjU4Ng0KCQkJYy0xLjg4NiwxLjE1Ny00LjQxOSwzLjE3NS03LjM5OCw1Ljg0OWMtMS42MTUtMS4wOTUtMy4zMzMtMi4wNDEtNS4xMDgtMi44OTFjMC44NDgtMy45MTIsMS4zNDctNy4xMDgsMS40MTMtOS4zMTNsLTMuODExLTEuMzc1DQoJCQljLTEuMzc3LDEuNzMxLTMuMDY2LDQuNDk5LTQuOTUyLDguMDM2Yy0xLjg4NC0wLjQ3NS0zLjgwNC0wLjg1NC01Ljc4Ni0xLjA0N0M1MS4zNTQsNS4yNDksNTAuNzIzLDIuMDg4LDUwLjAyNywwaC00LjA1NQ0KCQkJYy0wLjY5NSwyLjA4OC0xLjMyNyw1LjI0OS0xLjg3OCw5LjE5NmMtMS45ODEsMC4xOTQtMy45MDEsMC41NzMtNS43ODYsMS4wNDdjLTEuODg1LTMuNTM3LTMuNTc0LTYuMzA1LTQuOTUxLTguMDM2bC0zLjgxMSwxLjM3NQ0KCQkJYzAuMDY2LDIuMjA1LDAuNTY1LDUuNDAxLDEuNDEzLDkuMzEzYy0xLjc3NSwwLjg1LTMuNDkzLDEuNzk2LTUuMTA4LDIuODkxYy0yLjk3OS0yLjY3NC01LjUxMy00LjY5Mi03LjM5OC01Ljg0OWwtMy4xMDYsMi41ODYNCgkJCWMwLjgyMSwyLjA0NSwyLjM5LDQuODc1LDQuNTI5LDguMjU3Yy0xLjM2OCwxLjM5Mi0yLjYxNywyLjg5NC0zLjc2Niw0LjQ3NmMtMy43MzQtMS41MDctNi44MjEtMi41NDktOC45OTgtMi45OThsLTIuMDI4LDMuNDg0DQoJCQljMS40NzksMS42NDUsMy45MjksMy43NzIsNy4xMDYsNi4yMjVjLTAuODAzLDEuNzYyLTEuNDcxLDMuNTkxLTIuMDA2LDUuNDhjLTQuMDI2LTAuMTQ4LTcuMjgzLTAuMDgtOS40ODEsMC4yMzZMMCw0MS42NDYNCgkJCWMxLjk1OCwxLjA0NCw0Ljk5OCwyLjIxNSw4LjgzNywzLjQ0MUM4Ljc2Niw0Ni4wNTMsOC42ODksNDcuMDE3LDguNjg5LDQ4YzAsMC45ODIsMC4wNzYsMS45NDcsMC4xNDcsMi45MTINCgkJCUM0Ljk5OCw1Mi4xMzksMS45NTgsNTMuMzA5LDAsNTQuMzU0bDAuNzA0LDMuOTYzYzIuMTk4LDAuMzE2LDUuNDU2LDAuMzg1LDkuNDgxLDAuMjM2YzAuNTM1LDEuODksMS4yMDMsMy43MTksMi4wMDYsNS40OA0KCQkJYy0zLjE3OCwyLjQ1Mi01LjYyOCw0LjU4LTcuMTA2LDYuMjI1bDIuMDI4LDMuNDg0YzIuMTc2LTAuNDQ4LDUuMjYzLTEuNDksOC45OTgtMi45OThjMS4xNDgsMS41ODIsMi4zOTcsMy4wODUsMy43NjYsNC40NzcNCgkJCWMtMi4xNCwzLjM4MS0zLjcwOCw2LjIxMS00LjUyOSw4LjI1N2wzLjEwNiwyLjU4NWMxLjg4Ni0xLjE1Niw0LjQxOS0zLjE3Niw3LjM5OC01Ljg0OWMxLjYxNSwxLjA5NSwzLjMzMywyLjA0LDUuMTA4LDIuODkxDQoJCQljLTAuODQ5LDMuOTExLTEuMzQ3LDcuMTA4LTEuNDEzLDkuMzEybDMuODExLDEuMzc2YzEuMzc3LTEuNzMxLDMuMDY2LTQuNDk5LDQuOTUxLTguMDM3YzEuODg1LDAuNDc1LDMuODA1LDAuODU0LDUuNzg2LDEuMDQ5DQoJCQljMC41NTEsMy45NDYsMS4xODMsNy4xMDcsMS44NzgsOS4xOTVoNC4wNTVjMC42OTUtMi4wODgsMS4zMjctNS4yNDksMS44NzctOS4xOTVjMS45ODItMC4xOTQsMy45MDItMC41NzQsNS43ODYtMS4wNDkNCgkJCWMxLjg4NSwzLjUzOCwzLjU3NSw2LjMwNiw0Ljk1Miw4LjAzN2wzLjgxMS0xLjM3NmMtMC4wNjYtMi4yMDQtMC41NjQtNS40MDEtMS40MTMtOS4zMTJjMS43NzUtMC44NTEsMy40OTMtMS43OTYsNS4xMDgtMi44OTENCgkJCWMyLjk3OSwyLjY3Myw1LjUxMyw0LjY5Miw3LjM5OCw1Ljg0OWwzLjEwNi0yLjU4NWMtMC44MjEtMi4wNDYtMi4zOS00Ljg3Ni00LjUyOS04LjI1N2MxLjM2OC0xLjM5MiwyLjYxNy0yLjg5NSwzLjc2Ni00LjQ3Nw0KCQkJYzMuNzM0LDEuNTA4LDYuODIxLDIuNTUsOC45OTcsMi45OThsMi4wMjctMy40ODRjLTEuNDc4LTEuNjQ1LTMuOTI4LTMuNzcyLTcuMTA1LTYuMjI1YzAuODAzLTEuNzYyLDEuNDcxLTMuNTkxLDIuMDA2LTUuNDgNCgkJCWM0LjAyNSwwLjE0OCw3LjI4MywwLjA4LDkuNDgxLTAuMjM2TDk2LDU0LjM1NGMtMS45NTgtMS4wNDUtNC45OTgtMi4yMTUtOC44MzgtMy40NDFDODcuMjM0LDQ5Ljk0Nyw4Ny4zMTEsNDguOTgyLDg3LjMxMSw0OHoNCgkJCSBNNDgsODFjLTE4LjIyNiwwLTMzLTE0Ljc3NS0zMy0zM2MwLTE4LjIyNiwxNC43NzQtMzMsMzMtMzNjMTguMjI1LDAsMzMsMTQuNzc0LDMzLDMzQzgxLDY2LjIyNSw2Ni4yMjUsODEsNDgsODF6IE00OCwyNw0KCQkJYy0xMS41OTgsMC0yMSw5LjQwMi0yMSwyMXM5LjQwMiwyMSwyMSwyMXMyMS05LjQwMiwyMS0yMVM1OS41OTgsMjcsNDgsMjd6IE00OCw1N2MtNC45NzEsMC05LTQuMDI5LTktOXM0LjAyOS05LDktOXM5LDQuMDI5LDksOQ0KCQkJUzUyLjk3MSw1Nyw0OCw1N3oiLz4NCgk8L2c+DQo8L2c+DQo8L3N2Zz4NCg=='

    indicatorDOM.appendChild(imgDOM)
    var progressWrapper = document.createElement('div')
    progressWrapper.style.textAlign = 'center'
    progressWrapper.style.margin = '2em'
    var progressDOM = document.createElement('div')
    progressDOM.className = 'progress spinner-progress'
    progressDOM.style.display = 'inline-block'
    progressDOM.style.width = '30%'
    var progressBar = document.createElement('div')
    progressBar.className = 'progress-bar progress-bar-striped active'
    progressWrapper.appendChild(progressDOM)
    progressDOM.appendChild(progressBar)
    indicatorDOM.appendChild(progressWrapper)

    indicatorDOM.style = 'position:relative;transform:translateY(-50%);top:50%;'

    spinnerDOM.appendChild(indicatorDOM)

    spinnerDOM.style.position = 'absolute'
    spinnerDOM.style.textAlign = 'center'
    spinnerDOM.style.left = 0
    spinnerDOM.style.right = 0
    spinnerDOM.style.bottom = 0
    spinnerDOM.style.top = 0
    spinnerDOM.style.zIndex = 9999
    spinnerDOM.style.background = '#1c2B4B'

    document.body.appendChild(spinnerDOM)

    Spinner.show = function (options) {
        spinnerDOM.style.display = 'block'
        if(options && options.progress == false){
            progressDOM.style.display = 'none'
        }else{
            progressDOM.style.display = 'inline-block'
        }
    }
    
    Spinner.hide = function (resetFlag) {
        spinnerDOM.style.display = 'none'
        if(resetFlag){
            this.reset()
        }
    }

    Spinner.update = function (value) {
        value = parseInt(value)
        progressBar.innerHTML = value + '%'
        progressBar.style.width = value + '%'
    }

    Spinner.setBackgroundColor = function (color) {
        spinnerDOM.style.background = color
    }

    Spinner.reset = function () {
       this.update(0)
    }


    return Spinner
}))