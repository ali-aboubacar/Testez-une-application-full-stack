# Yoga App !


For launch and generate the jacoco code coverage:
> mvn clean test

GL

### Integration test
Ajouter ce bout de code dans le pom.xml pour executer uniquement les tests d'integration.
```pom.xml
			<plugin>
				<groupId>org.apache.maven.plugins</groupId>
				<artifactId>maven-surefire-plugin</artifactId>
				<version>3.0.0-M9</version>
				<configuration>
					<includes>
						<include>**/*IntegrationTest.java</include>
					</includes>
				</configuration>
			</plugin>
```
