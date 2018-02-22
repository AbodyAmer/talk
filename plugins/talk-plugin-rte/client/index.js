import Editor from './components/Editor';
import CommentContent from './containers/CommentContent';
import { gql } from 'react-apollo';

export default {
  slots: {
    textArea: [Editor],
    commentContent: [CommentContent],
  },
  fragments: {
    CreateCommentResponse: gql`
      fragment TalkRTE_CreateCommentResponse on CreateCommentResponse {
        comment {
          htmlBody
        }
      }
    `,
    EditCommentResponse: gql`
      fragment TalkRTE_EditCommentResponse on EditCommentResponse {
        comment {
          htmlBody
        }
      }
    `,
  },
  mutations: {
    PostComment: ({ variables: { input } }) => {
      return {
        optimisticResponse: {
          createComment: {
            comment: {
              htmlBody: input.htmlBody,
            },
          },
        },
      };
    },
    EditComment: ({ variables: { edit } }) => {
      return {
        optimisticResponse: {
          editComment: {
            comment: {
              htmlBody: edit.htmlBody,
            },
          },
        },
      };
    },
  },
};
