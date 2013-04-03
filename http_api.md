# Getters

## Code

URL: `/do/codeByID`

Required parameters:

* `id`: The uuid of the code being requested.

Response format: JSON

The response is an object whose attributes match the code setter parameters.

## Comment

URL: `/do/commentsOnLine`

Required parameters:

* `code_id`: The uuid of the code with which the comments are associated.
* `line`: The line on which the desired comments appear.

Response format: JSON

The response is an array of comment objects whose attributes match the comment
setter parameters.

## Comment Count

URL: `/do/commentCount`

Required parameters:

* `code_id`: The uuid of the code with which the comments are associated.

Response Format: JSON

The response is an object whose keys are the line numbers on which there are
comments, and whose associated values are the number of comments on that line.

# Setters

## Code

URL: `/do/newcode`

Required parameters:

* `text`: The (code) text of the code object.
* `lang': The programming language in which the text is written.

Response format: JSON

The response is an object with a single attribute:

* `id`: The randomly generated uuid assigned to the new code.

## Comment

URL: `/do/newcomment`

Required parameters:

* `code_id`: The uuid of the code with which the comment is to be associated.
* `text`: The comment text.
* `line_start`: The first line to which the comment refers.
* `line_end`: The last line to which the comment refers.
* `diffs`: The suggested changes to the referenced code in diff format.

Response format: JSON

The response is the comment object whose attributes are the same as the input
parameters.

# Authentication

## Login

URL: `/do/login`

Required parameters:

* `assertion`: A persona assertion to be validated.

Response format: JSON

The response is an object with a single attribute:

* `email`: the email address associated with the valid user.

## Logout

URL: `/do/logout`

Required parameters:

None!

Response format: JSON

The response is an empty object.
