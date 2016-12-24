define(['quark', 'knockout', 'quark-testing-helper'], function($$, ko, Helper) {
    var helper = new Helper({});

    describe('Home Page Tests', function() {
        beforeAll(function(done) {
            helper.load('home', done);
        })

        afterAll(function() {
            helper.reset();
        });

        it('must contain the correct title and description', function() {
            var home = helper.models.home;

            expect(home.name).toBe("Welcome to <%- name %> application");
            expect(home.description).toBe("<%- description %>");
        });
    });
});
