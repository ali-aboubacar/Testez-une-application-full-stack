package com.openclassrooms.starterjwt;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class SpringBootSecurityJwtApplicationUnitTest {

	@Test
	public void contextLoads() {
	}

	@Test
	void main() {
		// Ce test appelle directement la méthode main
		SpringBootSecurityJwtApplication.main(new String[]{});
	}
}
