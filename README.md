# Calendar API

To start this API, you need to create a `.env` file in the root of this folder with this content.

```
NODE_ENV="development"
DATABASE_USERNAME="root"
DATABASE_PASSWORD="root"
```

You need to update the username and password of the databse to the credentials of your local database.

You can also obtain to put the host and/or port in the .env if you did not choose the default values.

```
DATABASE_HOST="localhost"
DATABASE_PORT=3306
```

Please fill in your values.

## Start

Before you run the app, please install yarn by typing `yarn install` in the terminal.
After that, you can run the app using `yarn start`.

## Common errors

- Migrations failed: You must drop the existing database called `calendar` and rerun the app.
