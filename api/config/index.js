module.exports = {
    /**
     * roles:
     * 'superuser' - have access to any endpoint
     * 'adminRoles' - have access to any endpoints, except for 'changeUserRole' endpoint
     * 'editorRoles' - have access to any items created by 'user' role; Don't have permissions to user Profile
     * 'user' - have access to any public endpoints and own items and profile
     */
    roles: {
        superuser: 'superuser',
        adminRoles: ['superuser', 'moderator'],
        editorRoles: ['author', 'photo-author'],
        user: 'user'
    },
    client: {
        host: 'http://localhost',
        port: '3000'
    },

    db: {
        host: 'localhost',
        port: 5432,
        user: 'zandr',
        password: '',
        db_name: 'portal_test',
        charset: 'utf8'
    },

    token: {
        secret: 'Shhh908df97bf897gdf8bdf87dbcvbidfjgklrjt84'
    }
};
