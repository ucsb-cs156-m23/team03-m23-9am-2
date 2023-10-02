package edu.ucsb.cs156.example.web;

import edu.ucsb.cs156.example.testconfig.TestConfig;
import java.util.Collection;
import org.junit.runner.RunWith;
import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import javax.servlet.ServletContext;

import org.springframework.mock.web.MockServletContext;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.view;

import edu.ucsb.cs156.example.repositories.UserRepository;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.test.context.support.WithMockUser;


@ExtendWith(SpringExtension.class)
@ContextConfiguration(classes = { TestConfig.class })
@WebAppConfiguration(value = "")
public class V1IT {
    
    @Autowired
    private WebApplicationContext webApplicationContext;

    @MockBean
    UserRepository userRepository;

    private MockMvc mockMvc;
    @BeforeEach
    public void setup() throws Exception {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(this.webApplicationContext).build();
    }


    @WithMockUser(roles = { "USER", "ADMIN" })
    @Test
    public void givenWac_whenServletContext_thenItProvidesGreetController() {
        ServletContext servletContext = webApplicationContext.getServletContext();
    
        assertNotNull(servletContext);
        assertTrue(servletContext instanceof MockServletContext);
        //assertNotNull(webApplicationContext.getBean("HelpRequestController"));
        assertNull(webApplicationContext.getBean(""));
        assertNotNull(webApplicationContext.getBean(""));
    }

    // @WithMockUser(roles = { "USER", "ADMIN" })
    // @Test
    // public void givenHomePageURI_whenMockMVC_thenReturnsIndexJSPViewName() throws Exception {
    //     this.mockMvc.perform(get("/http://localhost:8080/spring-mvc-test/")).andDo(print())
    //         .andExpect(view().name("index"));
    // }

}
