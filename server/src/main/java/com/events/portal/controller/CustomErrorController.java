package com.events.portal.controller;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Serves a styled custom error page instead of Spring Boot's default Whitelabel
 * page for container-level errors (404, 500, etc.). Application-level exceptions
 * thrown by controllers are still handled as JSON by {@code GlobalExceptionHandler}.
 */
@RestController
public class CustomErrorController implements ErrorController {

    @RequestMapping("/error")
    public ResponseEntity<String> handleError(HttpServletRequest request) {
        Object statusObj = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
        int status = statusObj != null ? Integer.parseInt(statusObj.toString()) : 500;

        String title;
        String message;
        switch (status) {
            case 404 -> {
                title = "Page not found";
                message = "The page or resource you requested does not exist.";
            }
            case 403 -> {
                title = "Forbidden";
                message = "You don't have permission to access this resource.";
            }
            case 401 -> {
                title = "Unauthorized";
                message = "You need to sign in to access this resource.";
            }
            case 500 -> {
                title = "Internal server error";
                message = "Something went wrong on our side. Please try again later.";
            }
            default -> {
                HttpStatus resolved = HttpStatus.resolve(status);
                title = resolved != null ? resolved.getReasonPhrase() : "Error";
                message = "An unexpected error occurred.";
            }
        }

        return ResponseEntity.status(status)
                .contentType(MediaType.TEXT_HTML)
                .body(buildPage(status, title, message));
    }

    private String buildPage(int status, String title, String message) {
        return """
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>%d - %s</title>
                <style>
                    body {
                        margin: 0;
                        min-height: 100vh;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
                        background: #f5f6fa;
                        color: #1f2937;
                        text-align: center;
                        padding: 2rem;
                    }
                    .code {
                        font-size: 6rem;
                        font-weight: 800;
                        line-height: 1;
                        margin: 0;
                        background: linear-gradient(90deg, #4f46e5, #7c3aed);
                        -webkit-background-clip: text;
                        background-clip: text;
                        -webkit-text-fill-color: transparent;
                    }
                    h1 { font-size: 1.6rem; margin: 1rem 0 .5rem; }
                    p { color: #6b7280; max-width: 28rem; }
                    a {
                        margin-top: 1.5rem;
                        display: inline-block;
                        padding: .7rem 1.4rem;
                        border-radius: 10px;
                        font-weight: 600;
                        text-decoration: none;
                        color: #fff;
                        background: linear-gradient(180deg, #6366f1, #4f46e5);
                        box-shadow: 0 8px 18px rgba(79, 70, 229, .28);
                    }
                </style>
            </head>
            <body>
                <p class="code">%d</p>
                <h1>%s</h1>
                <p>%s</p>
                <a href="/">Back to Home</a>
            </body>
            </html>
            """.formatted(status, title, status, title, message);
    }
}
