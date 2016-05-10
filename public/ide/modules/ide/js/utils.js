/**
 * Created by deng on 16/4/27.
 */
/**
 * Created by wuya on 2016/4/27.
 */

var baseURL = '';

function postJSON(data, url, success, error) {
    $.ajax({
        url: baseURL + url,
        data: JSON.stringify(data),
        dataType: 'json',
        contentType: 'application/json',
        type: 'POST',
        success: success,
        error: error,
        timeout: 10000
    })
}

function getJSON(url, success, error) {
    $.ajax({
        url: baseURL + url,
        contentType: 'application/json',
        type: 'get',
        success: success,
        error: error
    })
}

