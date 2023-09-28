package edu.ucsb.cs156.example.integration;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
public class OAuthMvcIT  {

    @Autowired
    private WebApplicationContext context;

    private  MockMvc mvc;

    @Before
    public void setup() {
        mvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(springSecurity()) // enable security for the mock set up
                .build();
    }

    @WithMockUser(value = "test", password = "pass")
    @Test
    public void test() throws Exception {
        String contentType = MediaType.APPLICATION_JSON + ";charset=UTF-8";

        String authzToken = mvc
                .perform(
                        post("/authenticate")
                                .contentType(
                                        MediaType.APPLICATION_JSON).
                            content("")).
                 andExpect(status().isOk())
                .andExpect(content().contentType(contentType))
                .andExpect(jsonPath("$.token", is(notNullValue())))
                .andReturn().getResponse().getContentAsString();

        System.out.print(authzToken);//{"token":"1a3434a"}

    }

}