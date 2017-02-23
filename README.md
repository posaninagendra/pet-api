# pet-api
Pet Shelter API

This application provides three rest operations to manage a database of pets and their associated locations.

These operations are:

1. GET /pets - this will return all pets in the database.
2. GET /pets/{id} - this will return the pet with the given id, if it exists.
3. POST /pets - this will add a new pet to the database

The third operation expects the following data to be provided:
* name - the name of the pet
* type - the type of pet. e.g., dog, cat, etc
* breed - the breed of the pet
* location - a description of where the pet is located
* latitude - the latitude coordinate of the pet's location, which must be between -90 and +90 inclusive
* longitude - the longitude coordinate of the pet's location, which must be between -180 and +180 inclusive

Checks are also made to ensure that no pets of the same type have the same name. If an attempt is made to add such a duplicate, an error will be returned.

Each api operation will return a success flag (true or false). If the response is successful (success is true), the response will also contain a field called data which contains the returned data. If the response is unsuccessful, the response will contain a field called error which will contain a description of the error, if available.
