# Repositories
A repository contain SQL queries corresponding to various domain objects.
Repositories can be called directly from server rendered components.
Data access from the client can be done through server actions which are effectively API calls/lambdas.

No authZ access is done in repositories in order to not add overhead when querying across multiple models.
This comes at the expense of having to do AuthZ checks in server components which rely on one or more repositories.
