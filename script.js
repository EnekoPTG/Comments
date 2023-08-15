"use strict";
class CommentNode {
    constructor(id, text, isReply, parentId, commentId) {
        this.id = id;
        this.text = text;
        this.isReply = isReply;
        this.parentId = parentId;
        this.commentId = commentId;
    }
}
const commentsList = document.getElementById('comments-list');
const commentInput = document.getElementById('comment-input');
const submitButton = document.getElementById('submit-button');
const clearButton = document.getElementById('clear-button');
if (commentsList && commentInput && submitButton && clearButton) {
    let storedComments = JSON.parse(localStorage.getItem('comments') || '[]');
    function displayComments() {
        if (commentsList) {
            commentsList.innerHTML = '';
            storedComments.forEach((comment) => {
                addComment(comment);
            });
        }
    }
    displayComments();
    function addComment(comment) {
        const commentElement = document.createElement('div');
        commentElement.className = `comment${comment.isReply ? ' reply' : ''}`;
        commentElement.innerHTML = comment.text;
        commentElement.setAttribute('data-comment-id', comment.commentId);
        if (comment.parentId) {
            const parentCommentElement = commentsList.querySelector(`[data-comment-id="${comment.parentId}"]`);
            if (parentCommentElement) {
                const replyContainer = parentCommentElement.querySelector('.reply-container');
                if (!replyContainer) {
                    const newReplyContainer = document.createElement('div');
                    newReplyContainer.className = 'reply-container';
                    parentCommentElement.appendChild(newReplyContainer);
                }
                parentCommentElement.querySelector('.reply-container')?.appendChild(commentElement);
            }
        }
        else {
            commentsList.appendChild(commentElement);
        }
        commentInput.value = ''; // Очищаем поле ввода
    }
    submitButton.addEventListener('click', () => {
        const commentText = commentInput.value;
        if (commentText.trim() !== '') {
            if (commentText.length > 1000) {
                alert('Максимальная длина комментария 1000 символов.');
                return;
            }
            const newComment = {
                text: commentText,
                isReply: false,
                parentId: null,
                commentId: Date.now().toString(),
            };
            storedComments.push(newComment);
            localStorage.setItem('comments', JSON.stringify(storedComments));
            displayComments();
        }
    });
    commentsList.addEventListener('click', (event) => {
        const target = event.target;
        if (target.classList.contains('comment') && !target.classList.contains('reply')) {
            const replyText = prompt('Введите ответ на комментарий:');
            if (replyText !== null && typeof replyText === 'string') {
                if (replyText.length > 1000) {
                    alert('Максимальная длина ответа 1000 символов.');
                    return;
                }
                const commentId = target.getAttribute('data-comment-id');
                if (commentId) {
                    const newReply = {
                        text: replyText,
                        isReply: true,
                        parentId: commentId,
                        commentId: Date.now().toString(),
                    };
                    storedComments.push(newReply);
                    localStorage.setItem('comments', JSON.stringify(storedComments));
                    displayComments();
                }
            }
        }
    });
    clearButton.addEventListener('click', () => {
        localStorage.clear();
        storedComments = [];
        commentsList.innerHTML = '';
    });
}
