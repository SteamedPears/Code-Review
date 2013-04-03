# Getters

## Code

URL: `/do/codeByID`

Required parameters:

* `id`: The uuid of the code being requested.

### HTTP 200 Response

Successfully retrieved code from database.

Response format: JSON

The response is an object whose attributes match the code setter parameters.

### HTTP 400 Response

Invalid code id.  The `id` parameter was either malformed or not provided.

### HTTP 404 Response

Code not found.  The `id` parameter did not match a code object in the database.

### HTTP 500 Response

There was an error while reading from the database.

## Comment

URL: `/do/commentsOnLine`

Required parameters:

* `code_id`: The uuid of the code with which the comments are associated.
* `line`: The line on which the desired comments appear.

### HTTP 200 Response

Successfully retrieved comments from database.

Response format: JSON

The response is an array of comment objects whose attributes match the comment
setter parameters.

### HTTP 400 Response

The parameters were malformed or not provided.

### HTTP 404 Response

The parameters did not match any comments in the database.

### HTTP 500

There was an error while reading from the database.

## Comment Count

URL: `/do/commentCount`

Required parameters:

* `code_id`: The uuid of the code with which the comments are associated.

### HTTP 200 Response

Response Format: JSON

The response is an object whose keys are the line numbers on which there are
comments, and whose associated values are the number of comments on that line.

### HTTP 400 Response

The parameter was malformed or not provided.

### HTTP 404 Response

The parameter did not match any comments in the database.

### HTTP 500 Response

There was an error while reading from the database.

# Setters

## Code

URL: `/do/newcode`

Required parameters:

* `text`: The (code) text of the code object.
* `lang': The programming language in which the text is written.

### HTTP 200 Response

Successfully added code to database.

Response format: JSON

The response is an object with a single attribute:

* `id`: The randomly generated uuid assigned to the new code.

### HTTP 400 Response

One of the input parameters was invalid.  The response is in JSON format and has
a single attribute:

* `error`: a string description of which parameter was invalid.

### HTTP 500 Response

There was an error while writing to the database.

## Comment

URL: `/do/newcomment`

Required parameters:

* `code_id`: The uuid of the code with which the comment is to be associated.
* `text`: The comment text.
* `line_start`: The first line to which the comment refers.
* `line_end`: The last line to which the comment refers.
* `diffs`: The suggested changes to the referenced code in diff format.

### HTTP 200 Response

Successfully added comment to database.

Response format: JSON

The response is the comment object whose attributes are the same as the input
parameters.

### HTTP 400 Response

One of the input parameters was invalid.  The response is in JSON format and has
a single attribute:

* `error`: a string description of which parameter was invalid.

# Authentication

## Login

URL: `/do/login`

Required parameters:

* `assertion`: A persona assertion to be validated.

### HTTP 200 Response

Successfully validated persona assertion.  The session is now logged in as the
given user.

Response format: JSON

The response is an object with a single attribute:

* `email`: the email address associated with the valid user.

### HTTP 400 Response

The assertion was malformed or not provided.

### HTTP 401 Response

The assertion was not successfully validated.

## Logout

URL: `/do/logout`

Required parameters:

None!

### HTTP 200 Response

Successfully logged out.
