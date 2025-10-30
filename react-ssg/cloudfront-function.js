/**
 * CloudFront Function for SSG URL Rewriting
 *
 * 이 함수는 /detail/123 같은 URL을 /detail/123/index.html로 자동 변환합니다.
 * 이를 통해 각 영화 페이지의 고유한 메타 태그가 올바르게 표시됩니다.
 */

function handler(event) {
    var request = event.request;
    var uri = request.uri;

    // 이미 파일 확장자가 있는 경우 그대로 반환
    if (uri.includes('.')) {
        return request;
    }

    // 루트 경로 처리
    if (uri === '' || uri === '/') {
        request.uri = '/index.html';
        return request;
    }

    // /detail/123 형태의 경로를 /detail/123/index.html로 변환
    if (!uri.endsWith('/')) {
        request.uri = uri + '/index.html';
    } else {
        request.uri = uri + 'index.html';
    }

    return request;
}
