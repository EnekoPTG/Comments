interface Comment {
  text: string;
  isReply: boolean;
  parentId: string | null;
  commentId: string;
}

class CommentNode {
  constructor(
    public id: string,
    public text: string,
    public isReply: boolean,
    public parentId: string | null,
    public commentId: string
  ) {}
}

const commentsList = document.getElementById('comments-list') as HTMLElement;
const commentInput = document.getElementById('comment-input') as HTMLTextAreaElement;
const submitButton = document.getElementById('submit-button') as HTMLButtonElement;
const clearButton = document.getElementById('clear-button') as HTMLButtonElement;

if (commentsList && commentInput && submitButton && clearButton) {
  let storedComments: Comment[] = JSON.parse(localStorage.getItem('comments') || '[]');

  function displayComments() {
    if (commentsList) {
      commentsList.innerHTML = '';
      storedComments.forEach((comment) => {
        addComment(comment);
      });
    }
  }

  displayComments();

  function addComment(comment: Comment) {
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
    } else {
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
      
      const newComment: Comment = {
        text: commentText,
        isReply: false,
        parentId: null,
        commentId: Date.now().toString(),
      } as Comment;
      storedComments.push(newComment);
      localStorage.setItem('comments', JSON.stringify(storedComments));
      displayComments();
    }
  });
  
  commentsList.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    if (target.classList.contains('comment') && !target.classList.contains('reply')) {
      const replyText = prompt('Введите ответ на комментарий:');
      if (replyText !== null && typeof replyText === 'string') {
        if (replyText.length > 1000) {
          alert('Максимальная длина ответа 1000 символов.');
          return;
        }
        
        const commentId = target.getAttribute('data-comment-id');
        if (commentId) {
          const newReply: Comment = {
            text: replyText,
            isReply: true,
            parentId: commentId,
            commentId: Date.now().toString(),
          } as Comment;
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
