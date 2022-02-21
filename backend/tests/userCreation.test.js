const userCreationService = require("../services/userCreationService");

test("create and delete a user", async (done) => {
    const cres = await userCreationService.pureSignup("unittest@mail.com", "password"); 
    // console.log("after pure create")
    // console.log(cres)
    expect(cres.substring(0, 5)).not.toMatch('Error');
    const dres = await userCreationService.pureDeleteUser("unittest@mail.com")
    // console.log("after pure delete")
    // console.log(dres)
    expect(dres.status).toBe(200);
    done;
});

