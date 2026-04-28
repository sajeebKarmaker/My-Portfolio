# Spring Framework: Complete Guide

---

### TOPIC 1: Spring Fundamentals

---

## 1.1 What is Spring?

Spring is an **open-source, lightweight application framework** for Java. It was created by Rod Johnson in 2003, born out of frustration with the heavyweight complexity of Java EE (Enterprise Edition).

Before Spring, building enterprise Java apps meant dealing with:
- EJBs (Enterprise JavaBeans) — complex, heavyweight, hard to test
- XML hell and boilerplate code everywhere
- Tight coupling between components
- Difficult unit testing

Spring came in and said: *"Let's build enterprise applications the simple way."*

---

## 1.2 Problems Spring Solves

### Problem 1: Tight Coupling

Without Spring, a typical class looks like this:

```java
public class OrderService {
    // Direct instantiation — tightly coupled
    private PaymentService paymentService = new PaymentService();
    private EmailService emailService = new EmailService();

    public void placeOrder(Order order) {
        paymentService.charge(order);
        emailService.sendConfirmation(order);
    }
}
```

**Problems here:**
- `OrderService` is responsible for creating its own dependencies
- You cannot swap `PaymentService` with a mock in tests
- If `PaymentService` constructor changes, `OrderService` breaks
- Violates the Single Responsibility Principle

### Problem 2: Boilerplate Code

Pre-Spring Java EE required enormous boilerplate for transactions, resource management, JDBC, etc.

### Problem 3: Testability

Tightly coupled classes are nearly impossible to unit test in isolation.

### Problem 4: Configuration and Wiring

Manually wiring hundreds of objects together in large applications is error-prone and hard to maintain.

---

## 1.3 Inversion of Control (IoC)

**IoC is a design principle**, not a Spring-specific concept.

### Traditional Control Flow (Without IoC)

```
Your Code → creates → Dependencies
```

Your class controls everything. It decides when and how to create its collaborators.

### Inverted Control Flow (With IoC)

```
Framework → creates and injects → Dependencies into Your Code
```

You give up control of object creation to an external container. The framework calls your code, not the other way around. This is called the **"Hollywood Principle"**: *"Don't call us, we'll call you."*

### Concrete Example

```java
// WITHOUT IoC — you control dependency creation
public class UserService {
    private UserRepository repo = new MySQLUserRepository(); // hardcoded!

    public User findUser(Long id) {
        return repo.findById(id);
    }
}

// WITH IoC — framework controls dependency creation
public class UserService {
    private UserRepository repo; // just a reference

    public UserService(UserRepository repo) { // someone else provides it
        this.repo = repo;
    }

    public User findUser(Long id) {
        return repo.findById(id);
    }
}
```

In the IoC version:
- `UserService` doesn't know or care how `UserRepository` is created
- You can inject `MySQLUserRepository`, `MongoUserRepository`, or `MockUserRepository`
- Testing becomes trivial

---

## 1.4 Dependency Injection (DI)

**DI is the mechanism that implements IoC.** It's the specific technique where an object's dependencies are provided (injected) from the outside rather than created internally.

Spring's IoC Container is responsible for:
1. Creating objects (beans)
2. Wiring their dependencies together
3. Managing their lifecycle

```java
// Spring manages this entire wiring process
@Service
public class OrderService {
    private final PaymentService paymentService;
    private final EmailService emailService;

    // Spring injects these automatically
    public OrderService(PaymentService paymentService, EmailService emailService) {
        this.paymentService = paymentService;
        this.emailService = emailService;
    }
}
```

You define *what* you need. Spring figures out *how* to provide it.

---

## 1.5 Why Spring Exists Beyond Convenience

Spring isn't just about saving keystrokes. It enforces and enables:

| Benefit | What it means |
|---|---|
| **Loose coupling** | Components depend on abstractions, not implementations |
| **Testability** | Any bean can be tested with mocked dependencies |
| **Modularity** | You only include what you need (spring-web, spring-data, etc.) |
| **Declarative programming** | `@Transactional`, `@Secured` — behavior without boilerplate |
| **Consistency** | One way to handle transactions, security, validation across your app |
| **Ecosystem** | Spring Data, Spring Security, Spring Cloud — everything integrates |

---

# TOPIC 2: Spring Container and Core Architecture

---

## 2.1 What is the Spring Container?

The Spring Container is the **heart of the Spring Framework**. It is responsible for:

- Instantiating beans
- Configuring beans (injecting dependencies)
- Managing the complete bean lifecycle
- Assembling the application from its parts

There are **two types** of Spring containers:

---

## 2.2 BeanFactory

`BeanFactory` is the **root interface** of the Spring IoC container. It's the most basic container.

```java
// BeanFactory interface (simplified)
public interface BeanFactory {
    Object getBean(String name) throws BeansException;
    <T> T getBean(Class<T> requiredType) throws BeansException;
    boolean containsBean(String name);
    boolean isSingleton(String name);
    boolean isPrototype(String name);
    Class<?> getType(String name);
}
```

### Key characteristics of BeanFactory:
- **Lazy initialization by default** — beans are created only when first requested
- Minimal footprint — suitable for resource-constrained environments
- Does NOT support annotation-based configuration natively
- Does NOT support AOP, events, i18n out of the box

### When is BeanFactory actually used?
- Almost never in modern applications
- Historically used in memory-constrained environments (old mobile/embedded systems)
- Sometimes used in frameworks building on top of Spring where lightweight container is needed

```java
// Very old-style usage (you'd never write this today)
Resource resource = new ClassPathResource("beans.xml");
BeanFactory factory = new XmlBeanFactory(resource); // deprecated
MyBean bean = factory.getBean(MyBean.class);
```

---

## 2.3 ApplicationContext

`ApplicationContext` **extends** `BeanFactory` and adds enterprise-specific features. This is what you always use in real applications.

```java
public interface ApplicationContext extends 
    EnvironmentCapable,
    ListableBeanFactory,      // extends BeanFactory
    HierarchicalBeanFactory,  // parent/child context
    MessageSource,            // i18n support
    ApplicationEventPublisher, // event publishing
    ResourcePatternResolver {  // resource loading
}
```

### What ApplicationContext adds over BeanFactory:

| Feature | BeanFactory | ApplicationContext |
|---|---|---|
| Bean instantiation | ✅ | ✅ |
| Dependency injection | ✅ | ✅ |
| Eager initialization | ❌ | ✅ (default for singletons) |
| BeanPostProcessor auto-detection | ❌ (manual) | ✅ (automatic) |
| BeanFactoryPostProcessor auto-detection | ❌ (manual) | ✅ (automatic) |
| Internationalization (i18n) | ❌ | ✅ |
| Application events | ❌ | ✅ |
| AOP integration | ❌ | ✅ |
| `@Autowired`, `@Value` support | ❌ | ✅ |
| Environment/Profiles | ❌ | ✅ |

### Common ApplicationContext implementations:

```java
// 1. For XML-based config from classpath
ApplicationContext ctx = new ClassPathXmlApplicationContext("applicationContext.xml");

// 2. For XML-based config from filesystem
ApplicationContext ctx = new FileSystemXmlApplicationContext("/etc/myapp/beans.xml");

// 3. For Java-based config (most common today)
ApplicationContext ctx = new AnnotationConfigApplicationContext(AppConfig.class);

// 4. For web applications (used internally by Spring MVC)
// WebApplicationContext — loaded by DispatcherServlet
```

### Using the context:

```java
ApplicationContext ctx = new AnnotationConfigApplicationContext(AppConfig.class);

// Get bean by type
UserService userService = ctx.getBean(UserService.class);

// Get bean by name
UserService userService = (UserService) ctx.getBean("userService");

// Get bean by name and type (safest)
UserService userService = ctx.getBean("userService", UserService.class);
```

---

## 2.4 Core Container Modules

Spring is modular. The core container is made of these JARs:

### spring-core
The foundational module. Contains:
- Core utilities used across all Spring modules
- `ReflectionUtils`, `StringUtils`, `ClassUtils`
- Resource abstraction (`Resource`, `ClassPathResource`, `FileSystemResource`)
- Type conversion system

### spring-beans
Contains everything related to bean creation and wiring:
- `BeanFactory` interface and implementations
- `BeanDefinition` — the metadata about a bean
- `BeanWrapper` — reflection-based property access
- XML parsing for `<bean>` definitions

### spring-context
Builds on spring-beans. Contains:
- `ApplicationContext` and all its implementations
- `ApplicationEvent` and `ApplicationListener`
- `MessageSource` for i18n
- `@Component`, `@Autowired`, `@Value` annotation processing
- AOP infrastructure hooks

### spring-expression (SpEL — Spring Expression Language)
A powerful expression language for querying/manipulating objects at runtime.

```java
// SpEL in annotations
@Value("#{systemProperties['user.home']}")
private String userHome;

@Value("#{orderService.maxItems}")
private int maxItems;

@Value("#{T(java.lang.Math).PI}")
private double pi;

// SpEL programmatically
ExpressionParser parser = new SpelExpressionParser();
Expression exp = parser.parseExpression("'Hello World'.length()");
Integer length = (Integer) exp.getValue(); // 11

// SpEL with context
StandardEvaluationContext context = new StandardEvaluationContext(myObject);
Expression exp = parser.parseExpression("name.toUpperCase()");
String name = exp.getValue(context, String.class);
```

---

# TOPIC 3: Bean Definition and Configuration

---

## 3.1 What is a Bean?

A **bean** is simply an object that is managed by the Spring IoC container. Any POJO can be a bean if you tell Spring about it.

A `BeanDefinition` is the **metadata** Spring uses to create and configure a bean. It contains:
- Class name
- Scope (singleton, prototype, etc.)
- Constructor arguments / property values
- Init and destroy method names
- Lazy init flag
- Dependencies

---

## 3.2 XML-Based Configuration

The original way of configuring Spring. Still used in legacy codebases.

```xml
<!-- applicationContext.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
           http://www.springframework.org/schema/beans/spring-beans.xsd">

    <!-- Simple bean -->
    <bean id="paymentService" class="com.example.PaymentService"/>

    <!-- Bean with constructor injection -->
    <bean id="orderService" class="com.example.OrderService">
        <constructor-arg ref="paymentService"/>
        <constructor-arg ref="emailService"/>
    </bean>

    <!-- Bean with setter injection -->
    <bean id="reportService" class="com.example.ReportService">
        <property name="dataSource" ref="dataSource"/>
        <property name="maxRows" value="1000"/>
    </bean>

    <!-- Bean with init and destroy methods -->
    <bean id="connectionPool" 
          class="com.example.ConnectionPool"
          init-method="init"
          destroy-method="cleanup"/>

    <!-- Singleton (default) -->
    <bean id="cacheManager" class="com.example.CacheManager" scope="singleton"/>

    <!-- Prototype -->
    <bean id="reportTemplate" class="com.example.ReportTemplate" scope="prototype"/>

</beans>
```

Loading it:
```java
ApplicationContext ctx = new ClassPathXmlApplicationContext("applicationContext.xml");
OrderService orderService = ctx.getBean(OrderService.class);
```

---

## 3.3 Java-Based Configuration

Modern approach. Type-safe, refactor-friendly, IDE-supported.

```java
@Configuration
public class AppConfig {

    @Bean
    public PaymentService paymentService() {
        return new StripePaymentService();
    }

    @Bean
    public EmailService emailService() {
        return new SmtpEmailService("smtp.example.com", 587);
    }

    @Bean
    public OrderService orderService() {
        // Spring calls these methods and manages the returned beans
        return new OrderService(paymentService(), emailService());
    }

    @Bean(initMethod = "init", destroyMethod = "cleanup")
    public ConnectionPool connectionPool() {
        ConnectionPool pool = new ConnectionPool();
        pool.setMaxSize(10);
        return pool;
    }
}
```

```java
// Loading Java config
ApplicationContext ctx = new AnnotationConfigApplicationContext(AppConfig.class);
```

---

## 3.4 @Configuration vs @Component

This is a **critical distinction** that trips up many developers.

### @Component

```java
@Component
public class PaymentService {
    // Spring detects and registers this as a bean via component scanning
}
```

`@Component` marks a class for **component scanning**. Spring will find it and register it as a bean with default settings.

### @Configuration

```java
@Configuration
public class AppConfig {

    @Bean
    public PaymentService paymentService() {
        return new PaymentService();
    }

    @Bean
    public OrderService orderService() {
        return new OrderService(paymentService()); // calls paymentService()
    }
}
```

`@Configuration` is a **specialized `@Component`** that also tells Spring: *"This class declares bean definitions. Treat `@Bean` method calls specially."*

### The Critical Difference: CGLIB Proxying

When a class is annotated with `@Configuration`, Spring creates a **CGLIB subclass proxy** of it. This proxy intercepts `@Bean` method calls.

```java
@Configuration
public class AppConfig {

    @Bean
    public PaymentService paymentService() {
        System.out.println("Creating PaymentService");
        return new PaymentService();
    }

    @Bean
    public OrderService orderService() {
        return new OrderService(paymentService()); // this looks like it creates a new instance
    }

    @Bean
    public AuditService auditService() {
        return new AuditService(paymentService()); // and this too
    }
}
```

With `@Configuration`, `paymentService()` is only called **once** because the CGLIB proxy intercepts the call and returns the existing singleton bean. Both `OrderService` and `AuditService` get the **same** `PaymentService` instance.

Without `@Configuration` (using just `@Component` on a config class — called "lite mode"):

```java
@Component // NOT @Configuration — "lite mode"
public class AppConfig {

    @Bean
    public PaymentService paymentService() {
        return new PaymentService(); // creates a NEW instance every time!
    }

    @Bean
    public OrderService orderService() {
        return new OrderService(paymentService()); // new PaymentService!
    }
}
```

In lite mode, `paymentService()` is a **regular Java method call** — it creates a new `PaymentService` on each invocation. This breaks singleton semantics.

**Rule of thumb:** Always use `@Configuration` when your config class has `@Bean` methods that call each other.

---

## 3.5 @Bean vs @Component

| Aspect | `@Bean` | `@Component` |
|---|---|---|
| Where it goes | On a method inside a `@Configuration` class | On a class |
| Who creates the object | You write the method body | Spring instantiates the class |
| Control over creation | Full control | Limited (Spring calls no-arg constructor or constructor injection) |
| Third-party classes | ✅ Can register any object as a bean | ❌ Can't add to a class you don't own |
| Use case | External libraries, complex construction logic | Your own classes |

```java
// @Bean — useful for third-party classes you don't own
@Configuration
public class DataSourceConfig {

    @Bean
    public DataSource dataSource() {
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl("jdbc:mysql://localhost/mydb");
        config.setUsername("root");
        config.setPassword("secret");
        config.setMaximumPoolSize(20);
        return new HikariDataSource(config); // third-party class
    }
}

// @Component — for your own classes
@Component
public class UserService {
    // Spring creates this
}
```

---

## 3.6 Component Scanning

Component scanning is how Spring **automatically discovers** beans without you explicitly declaring each one.

```java
@Configuration
@ComponentScan(basePackages = "com.example")
public class AppConfig {
    // Spring scans com.example and all sub-packages
}
```

Or with Spring Boot (which does this automatically):

```java
@SpringBootApplication // includes @ComponentScan for the current package and below
public class MyApp {
    public static void main(String[] args) {
        SpringApplication.run(MyApp.class, args);
    }
}
```

### Stereotype Annotations (all are `@Component` variants):

```java
@Component       // generic Spring bean
@Service         // service layer (business logic)
@Repository      // data access layer (adds exception translation)
@Controller      // Spring MVC controller
@RestController  // @Controller + @ResponseBody
```

All of these are functionally equivalent for bean registration. The different names communicate intent and enable specific behaviors (e.g., `@Repository` enables persistence exception translation).

### Filtering Component Scanning:

```java
@ComponentScan(
    basePackages = "com.example",
    includeFilters = @ComponentScan.Filter(
        type = FilterType.ANNOTATION, 
        classes = MyCustomAnnotation.class
    ),
    excludeFilters = @ComponentScan.Filter(
        type = FilterType.ASSIGNABLE_TYPE, 
        classes = TestConfiguration.class
    )
)
```

---

## 3.7 BeanDefinition Concept

Every bean registered with Spring has an underlying `BeanDefinition` object that holds all its metadata.

```java
// You can inspect BeanDefinitions programmatically
ApplicationContext ctx = new AnnotationConfigApplicationContext(AppConfig.class);
ConfigurableListableBeanFactory factory = ((ConfigurableApplicationContext) ctx).getBeanFactory();

BeanDefinition bd = factory.getBeanDefinition("orderService");

System.out.println(bd.getBeanClassName());     // com.example.OrderService
System.out.println(bd.getScope());             // singleton
System.out.println(bd.isLazyInit());           // false
System.out.println(bd.isSingleton());          // true
System.out.println(bd.getConstructorArgumentValues()); // constructor args
```

You can even **register beans programmatically** at runtime:

```java
GenericApplicationContext ctx = new GenericApplicationContext();
ctx.registerBeanDefinition("myService",
    BeanDefinitionBuilder.genericBeanDefinition(MyService.class)
        .setScope(BeanDefinition.SCOPE_SINGLETON)
        .addConstructorArgReference("dependencyBean")
        .getBeanDefinition()
);
ctx.refresh();
```

---

# TOPIC 4: Dependency Injection (Deep Understanding)

---

## 4.1 Constructor Injection

Dependencies are provided through the class constructor.

```java
@Service
public class OrderService {

    private final PaymentService paymentService;
    private final EmailService emailService;
    private final InventoryService inventoryService;

    // @Autowired is optional since Spring 4.3 if there's only one constructor
    public OrderService(PaymentService paymentService,
                        EmailService emailService,
                        InventoryService inventoryService) {
        this.paymentService = paymentService;
        this.emailService = emailService;
        this.inventoryService = inventoryService;
    }
}
```

**Why constructor injection is preferred:**
- Dependencies are `final` — guaranteed immutability
- The object is **always fully initialized** after construction
- Missing dependencies cause fail-fast at startup
- Easy to test — just call `new OrderService(mockPayment, mockEmail, mockInventory)`
- Makes circular dependencies visible (Spring throws an error instead of silently creating broken objects)

---

## 4.2 Setter Injection

Dependencies are provided through setter methods after construction.

```java
@Service
public class ReportService {

    private DataSource dataSource;
    private int maxRows;

    @Autowired
    public void setDataSource(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Autowired(required = false)
    public void setMaxRows(int maxRows) {
        this.maxRows = maxRows;
    }
}
```

**When setter injection makes sense:**
- **Optional dependencies** — the bean can work without it
- **Reconfigurable dependencies** — need to change after construction
- When working with frameworks that require a no-arg constructor
- Circular dependency resolution (last resort)

**Drawbacks:**
- Object can be in a partially initialized state
- No `final` fields — mutable state
- Harder to spot missing dependencies

---

## 4.3 Field Injection (and Why It's Discouraged)

```java
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository; // field injection

    @Autowired
    private EmailService emailService;
}
```

**Why field injection is discouraged:**

1. **Not testable without Spring**: You can't inject mocks without reflection or a Spring test context
   ```java
   // To test, you MUST use Spring or reflection hacks
   UserService service = new UserService(); // userRepository is null!
   ```

2. **Hides design problems**: When a class has 10 `@Autowired` fields, it's obvious the class does too much. Constructor injection forces you to confront this.

3. **Breaks immutability**: No `final` fields

4. **Framework coupling**: The class only works inside a Spring container

5. **Difficult to spot required vs optional** dependencies

```java
// The test you have to write with field injection:
@Test
void test() {
    UserService service = new UserService();
    ReflectionTestUtils.setField(service, "userRepository", mockRepo); // hack!
}

// With constructor injection:
@Test
void test() {
    UserService service = new UserService(mockRepo, mockEmail); // clean!
}
```

---

## 4.4 Circular Dependencies

A circular dependency occurs when Bean A depends on Bean B, and Bean B depends on Bean A.

```java
@Service
public class A {
    private final B b;
    public A(B b) { this.b = b; }
}

@Service
public class B {
    private final A a;
    public B(A a) { this.a = a; }
}
```

**With constructor injection:** Spring throws `BeanCurrentlyInCreationException` — this is **correct behavior**. Circular dependencies indicate a design flaw.

**With setter/field injection:** Spring can resolve it by creating a partially initialized proxy — but this is dangerous and hides design problems.

### How to fix circular dependencies:

**Option 1: Redesign — Extract a third class**
```java
// Move shared logic to a new class C
@Service
public class C {
    // shared behavior that both A and B needed from each other
}

@Service
public class A {
    private final C c;
    public A(C c) { this.c = c; }
}

@Service
public class B {
    private final C c;
    public B(C c) { this.c = c; }
}
```

**Option 2: Use `@Lazy` on one dependency**
```java
@Service
public class A {
    private final B b;
    public A(@Lazy B b) { this.b = b; } // Spring injects a proxy, resolves later
}
```

**Option 3: Use setter injection for one side (last resort)**

---

## 4.5 Lazy vs Eager Initialization

### Eager (Default for Singleton beans)

By default, all singleton beans are created when the `ApplicationContext` starts up.

**Benefits:**
- Fail fast — configuration errors detected at startup
- Predictable startup — no hidden delays when first request comes in

### Lazy Initialization

```java
@Component
@Lazy
public class HeavyService {
    // Only created when first requested
    public HeavyService() {
        // expensive initialization
    }
}
```

```java
// In Java config
@Bean
@Lazy
public HeavyService heavyService() {
    return new HeavyService();
}
```

```java
// Make all beans lazy globally (Spring Boot)
# application.properties
spring.main.lazy-initialization=true
```

**When to use `@Lazy`:**
- Expensive startup cost for a rarely-used bean
- Circular dependency resolution (not ideal)
- Speeding up development-time startup

**Downside:** Configuration errors surface at runtime, not startup.

---

## 4.6 Autowiring Resolution Rules

When Spring sees `@Autowired`, it goes through this resolution process:

### Step 1: Type matching
Spring looks for beans that match the declared type.

```java
@Autowired
private PaymentService paymentService; // find all beans of type PaymentService
```

### Step 2: If exactly one match → inject it

### Step 3: If multiple matches → try to narrow by name

```java
@Autowired
private PaymentService stripePaymentService;
// Spring tries to find a bean named "stripePaymentService"
```

### Step 4: If still ambiguous → throw `NoUniqueBeanDefinitionException`

### Step 5: If no match → throw `NoSuchBeanDefinitionException` (unless `required = false`)

---

## 4.7 @Primary

When multiple beans of the same type exist, `@Primary` tells Spring which one to use by default.

```java
public interface PaymentService { void charge(Order order); }

@Service
@Primary  // this is the default
public class StripePaymentService implements PaymentService { ... }

@Service
public class PayPalPaymentService implements PaymentService { ... }

// This injects StripePaymentService by default
@Autowired
private PaymentService paymentService;
```

---

## 4.8 @Qualifier

`@Qualifier` gives you explicit control when multiple beans of the same type exist.

```java
@Autowired
@Qualifier("payPalPaymentService")
private PaymentService paymentService; // explicitly selects PayPal

// Or with custom qualifier annotation
@Autowired
@Qualifier("stripe")
private PaymentService paymentService;
```

```java
// Defining qualifier on bean
@Service
@Qualifier("stripe")
public class StripePaymentService implements PaymentService { ... }
```

### Custom Qualifier Annotation

```java
@Target({ElementType.FIELD, ElementType.PARAMETER, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Qualifier
public @interface Stripe {}

@Service
@Stripe
public class StripePaymentService implements PaymentService { ... }

// Usage:
@Autowired
@Stripe
private PaymentService paymentService;
```

---

# TOPIC 5: Bean Lifecycle

---

## 5.1 The Complete Bean Lifecycle

This is one of the most important topics for interviews. The complete lifecycle in order:

```
1. Bean class loaded
2. BeanDefinition created
3. BeanFactoryPostProcessor runs (can modify definitions)
4. Bean instantiated (constructor called)
5. Dependency injection (properties/setters set)
6. Aware interfaces called
   - BeanNameAware.setBeanName()
   - BeanFactoryAware.setBeanFactory()
   - ApplicationContextAware.setApplicationContext()
7. BeanPostProcessor.postProcessBeforeInitialization()
8. @PostConstruct method called
9. InitializingBean.afterPropertiesSet() called
10. Custom init-method called
11. BeanPostProcessor.postProcessAfterInitialization()
12. Bean is ready for use
13. ... (bean in use) ...
14. ApplicationContext.close() called
15. @PreDestroy method called
16. DisposableBean.destroy() called
17. Custom destroy-method called
```

---

## 5.2 Aware Interfaces

Aware interfaces allow beans to interact with the Spring container.

```java
@Component
public class MyBean implements BeanNameAware, ApplicationContextAware, BeanFactoryAware {

    private String beanName;
    private ApplicationContext applicationContext;
    private BeanFactory beanFactory;

    @Override
    public void setBeanName(String name) {
        // Called with the bean's name in the container
        this.beanName = name;
        System.out.println("Bean name: " + name);
    }

    @Override
    public void setApplicationContext(ApplicationContext ctx) {
        // Access to the full ApplicationContext
        this.applicationContext = ctx;
    }

    @Override
    public void setBeanFactory(BeanFactory factory) {
        this.beanFactory = factory;
    }
}
```

**Common Aware interfaces:**

| Interface | Method | Provides |
|---|---|---|
| `BeanNameAware` | `setBeanName(String)` | The bean's name |
| `BeanFactoryAware` | `setBeanFactory(BeanFactory)` | The owning BeanFactory |
| `ApplicationContextAware` | `setApplicationContext(ApplicationContext)` | The ApplicationContext |
| `EnvironmentAware` | `setEnvironment(Environment)` | Environment/properties |
| `ResourceLoaderAware` | `setResourceLoader(ResourceLoader)` | For loading classpath resources |

---

## 5.3 BeanPostProcessor

`BeanPostProcessor` is one of the most powerful extension points in Spring. It lets you intercept bean creation **after instantiation but around initialization**.

```java
public interface BeanPostProcessor {
    // Called BEFORE init methods (@PostConstruct, afterPropertiesSet, init-method)
    default Object postProcessBeforeInitialization(Object bean, String beanName) {
        return bean;
    }

    // Called AFTER init methods
    default Object postProcessAfterInitialization(Object bean, String beanName) {
        return bean;
    }
}
```

### Custom BeanPostProcessor Example:

```java
@Component
public class LoggingBeanPostProcessor implements BeanPostProcessor {

    @Override
    public Object postProcessBeforeInitialization(Object bean, String beanName) {
        System.out.println("Before init: " + beanName);
        return bean; // return the (possibly modified) bean
    }

    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName) {
        System.out.println("After init: " + beanName);
        // You can return a PROXY instead of the original bean!
        return bean;
    }
}
```

**Critical insight:** `postProcessAfterInitialization` can return a **completely different object** — this is exactly how Spring implements AOP proxying and `@Transactional`. The original bean is replaced with a proxy.

---

## 5.4 Initialization Callbacks

Three ways to define initialization logic, all called in this order:

```java
@Component
public class DatabaseConnectionPool {

    private Connection[] pool;

    // 1. @PostConstruct — JSR-250, preferred
    @PostConstruct
    public void init() {
        System.out.println("@PostConstruct called");
        this.pool = createConnections(10);
    }
}
```

```java
// 2. InitializingBean interface
@Component
public class DatabaseConnectionPool implements InitializingBean {

    @Override
    public void afterPropertiesSet() throws Exception {
        System.out.println("afterPropertiesSet called");
        // Called after all properties are set
    }
}
```

```java
// 3. Custom init method in @Bean
@Bean(initMethod = "initialize")
public DatabaseConnectionPool connectionPool() {
    return new DatabaseConnectionPool();
}

public class DatabaseConnectionPool {
    public void initialize() {
        System.out.println("Custom init method called");
    }
}
```

**Order:** `@PostConstruct` → `afterPropertiesSet()` → custom `init-method`

---

## 5.5 Destruction Callbacks

```java
@Component
public class DatabaseConnectionPool {

    // 1. @PreDestroy — preferred
    @PreDestroy
    public void cleanup() {
        System.out.println("@PreDestroy called");
        // close all connections
    }
}

// 2. DisposableBean interface
@Component
public class DatabaseConnectionPool implements DisposableBean {
    @Override
    public void destroy() throws Exception {
        System.out.println("DisposableBean.destroy() called");
    }
}

// 3. Custom destroy method
@Bean(destroyMethod = "shutdown")
public DatabaseConnectionPool connectionPool() { ... }
```

**Order:** `@PreDestroy` → `destroy()` → custom `destroy-method`

**Important:** Destruction callbacks are only called for **singleton** beans. Prototype beans are not managed after creation — Spring hands them off and forgets them.

---

## 5.6 BeanFactoryPostProcessor

Operates on **BeanDefinition metadata** BEFORE any beans are instantiated. This lets you modify bean definitions before the container creates objects.

```java
public interface BeanFactoryPostProcessor {
    void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory);
}
```

```java
@Component
public class CustomBeanFactoryPostProcessor implements BeanFactoryPostProcessor {

    @Override
    public void postProcessBeanFactory(ConfigurableListableBeanFactory factory) {
        // Modify bean definitions before instantiation
        BeanDefinition bd = factory.getBeanDefinition("orderService");
        bd.setScope(BeanDefinition.SCOPE_PROTOTYPE); // change scope!
        
        // Or inspect all beans
        String[] beanNames = factory.getBeanDefinitionNames();
        for (String name : beanNames) {
            System.out.println("Bean definition: " + name);
        }
    }
}
```

**Built-in BeanFactoryPostProcessors:**
- `PropertySourcesPlaceholderConfigurer` — resolves `${property.key}` placeholders
- `PropertyOverrideConfigurer` — overrides bean properties from property files

---

## 5.7 BeanDefinitionRegistryPostProcessor

Extends `BeanFactoryPostProcessor` with the ability to **add new bean definitions** to the registry.

```java
public interface BeanDefinitionRegistryPostProcessor extends BeanFactoryPostProcessor {
    void postProcessBeanDefinitionRegistry(BeanDefinitionRegistry registry);
}
```

```java
@Component
public class DynamicBeanRegistrar implements BeanDefinitionRegistryPostProcessor {

    @Override
    public void postProcessBeanDefinitionRegistry(BeanDefinitionRegistry registry) {
        // Dynamically register new beans
        GenericBeanDefinition bd = new GenericBeanDefinition();
        bd.setBeanClass(DynamicService.class);
        registry.registerBeanDefinition("dynamicService", bd);
    }

    @Override
    public void postProcessBeanFactory(ConfigurableListableBeanFactory factory) {
        // Standard post-processing
    }
}
```

### Complete Order of Execution:

```
1. BeanDefinitionRegistryPostProcessor.postProcessBeanDefinitionRegistry()
   (can add new bean definitions)
2. BeanDefinitionRegistryPostProcessor.postProcessBeanFactory()
   (can modify existing definitions)
3. BeanFactoryPostProcessor.postProcessBeanFactory()
   (can modify definitions, cannot add new ones)
4. Bean instantiation begins
5. BeanPostProcessor.postProcessBeforeInitialization()
6. Init callbacks (@PostConstruct, afterPropertiesSet, init-method)
7. BeanPostProcessor.postProcessAfterInitialization()
8. Bean ready
```

---

# TOPIC 6: Scopes and Context Management

---

## 6.1 Singleton Scope (Default)

One instance per Spring container. Every request for the bean gets the **same object**.

```java
@Component
// @Scope("singleton") // this is the default, redundant to specify
public class UserService {
    // One instance for the entire application
}
```

```java
// Both variables point to the same object
UserService a = ctx.getBean(UserService.class);
UserService b = ctx.getBean(UserService.class);
System.out.println(a == b); // true
```

**Use for:** Stateless services, repositories, controllers — anything shared safely.

**Warning:** Never store user-specific or request-specific state in singleton beans!

---

## 6.2 Prototype Scope

A **new instance** is created every time the bean is requested.

```java
@Component
@Scope("prototype")
public class ReportGenerator {
    private List<ReportRow> rows = new ArrayList<>(); // state is per-instance
}
```

```java
ReportGenerator a = ctx.getBean(ReportGenerator.class);
ReportGenerator b = ctx.getBean(ReportGenerator.class);
System.out.println(a == b); // false — different objects
```

**Use for:** Stateful beans, objects that hold per-operation data, command objects.

**Important:** Spring does NOT manage the lifecycle of prototype beans after handing them off. `@PreDestroy` is **not called** for prototypes.

### Problem: Injecting prototype into singleton

```java
@Component
public class OrderProcessor { // singleton

    @Autowired
    private ReportGenerator reportGenerator; // prototype — but injected only ONCE!
    
    // Every call to processOrder uses the SAME reportGenerator instance!
    // This breaks the prototype semantic!
}
```

**Solutions:**

```java
// Option 1: ApplicationContext.getBean() — not ideal (Spring coupling)
@Component
public class OrderProcessor implements ApplicationContextAware {
    private ApplicationContext ctx;
    
    public void processOrder() {
        ReportGenerator rg = ctx.getBean(ReportGenerator.class); // fresh each time
    }
}

// Option 2: ObjectProvider (preferred)
@Component
public class OrderProcessor {
    
    @Autowired
    private ObjectProvider<ReportGenerator> reportGeneratorProvider;
    
    public void processOrder() {
        ReportGenerator rg = reportGeneratorProvider.getObject(); // fresh each time
    }
}

// Option 3: @Lookup (method injection)
@Component
public abstract class OrderProcessor {
    
    @Lookup
    public abstract ReportGenerator getReportGenerator(); // Spring provides implementation
    
    public void processOrder() {
        ReportGenerator rg = getReportGenerator(); // fresh each time
    }
}
```

---

## 6.3 Web Scopes

These require a web-aware `ApplicationContext`.

### Request Scope

One bean instance per HTTP request.

```java
@Component
@Scope(value = WebApplicationContext.SCOPE_REQUEST, proxyMode = ScopedProxyMode.TARGET_CLASS)
public class RequestContext {
    private String requestId = UUID.randomUUID().toString();
    private User currentUser;
    // fresh for every HTTP request
}
```

### Session Scope

One bean instance per HTTP session.

```java
@Component
@Scope(value = WebApplicationContext.SCOPE_SESSION, proxyMode = ScopedProxyMode.TARGET_CLASS)
public class ShoppingCart {
    private List<Item> items = new ArrayList<>();
    // persists across multiple requests from the same user
}
```

### Application Scope

One bean instance per `ServletContext` — effectively the same as singleton for most apps.

```java
@Component
@Scope(value = WebApplicationContext.SCOPE_APPLICATION)
public class AppStatistics {
    private AtomicLong requestCount = new AtomicLong();
}
```

---

## 6.4 Scope Proxying

This is critical to understand. When a narrow-scoped bean (request/session/prototype) is injected into a wider-scoped bean (singleton), you have a problem:

```java
@RestController  // singleton
public class CartController {

    @Autowired
    private ShoppingCart cart; // session-scoped — but injected once at startup!
    
    // All users would share the same cart without proxying!
}
```

**`proxyMode = ScopedProxyMode.TARGET_CLASS`** solves this by injecting a **CGLIB proxy** instead of the actual bean. The proxy knows to look up the correct scope-specific instance on each method call.

```java
@Component
@Scope(value = "session", proxyMode = ScopedProxyMode.TARGET_CLASS)
public class ShoppingCart {
    private List<Item> items = new ArrayList<>();
}

@RestController
public class CartController {

    @Autowired
    private ShoppingCart cart; // This is actually a PROXY
    
    @GetMapping("/cart")
    public List<Item> getCart() {
        // cart.getItems() -> proxy intercepts -> finds the real ShoppingCart
        //                    for THIS user's session -> delegates
        return cart.getItems();
    }
}
```

---

# TOPIC 7: Proxying and AOP

---

## 7.1 What is AOP?

**Aspect-Oriented Programming** complements OOP by allowing you to modularize **cross-cutting concerns** — behavior that spans multiple classes and layers.

Examples of cross-cutting concerns:
- Logging
- Security
- Transaction management
- Caching
- Performance monitoring
- Exception handling

Without AOP, you'd have this mess:

```java
public class OrderService {
    public Order placeOrder(Order order) {
        logger.info("Entering placeOrder"); // logging concern
        securityCheck(currentUser);          // security concern
        Transaction tx = beginTransaction(); // transaction concern
        try {
            Order result = doPlaceOrder(order); // actual business logic
            tx.commit();
            logger.info("Order placed successfully");
            return result;
        } catch (Exception e) {
            tx.rollback();
            logger.error("Order failed", e);
            throw e;
        }
    }
}
```

With AOP, your business method becomes clean:

```java
@Service
public class OrderService {
    public Order placeOrder(Order order) {
        return doPlaceOrder(order); // just business logic
    }
}
// Logging, transactions, security handled by aspects
```

---

## 7.2 AOP Concepts

### Join Point
A point during program execution where an aspect can be applied. In Spring AOP, a join point is always a **method execution**.

### Pointcut
An expression that matches join points. It defines *where* the advice applies.

```java
// Pointcut expression: all methods in OrderService
"execution(* com.example.OrderService.*(..))"

// All public methods in any class in com.example package
"execution(public * com.example.*.*(..))"

// All methods annotated with @Transactional
"@annotation(org.springframework.transaction.annotation.Transactional)"
```

### Advice
The action taken at a join point. *What* to do and *when* to do it.

**Types of Advice:**

```java
@Aspect
@Component
public class LoggingAspect {

    // Pointcut definition (reusable)
    @Pointcut("execution(* com.example.service.*.*(..))")
    public void serviceLayer() {}

    // @Before — runs BEFORE the method
    @Before("serviceLayer()")
    public void logBefore(JoinPoint joinPoint) {
        System.out.println("Calling: " + joinPoint.getSignature().getName());
    }

    // @After — runs AFTER the method (regardless of success/failure)
    @After("serviceLayer()")
    public void logAfter(JoinPoint joinPoint) {
        System.out.println("Finished: " + joinPoint.getSignature().getName());
    }

    // @AfterReturning — runs AFTER successful return
    @AfterReturning(pointcut = "serviceLayer()", returning = "result")
    public void logReturn(JoinPoint joinPoint, Object result) {
        System.out.println("Returned: " + result);
    }

    // @AfterThrowing — runs AFTER an exception is thrown
    @AfterThrowing(pointcut = "serviceLayer()", throwing = "ex")
    public void logException(JoinPoint joinPoint, Exception ex) {
        System.out.println("Exception in " + joinPoint.getSignature() + ": " + ex.getMessage());
    }

    // @Around — wraps the method, most powerful
    @Around("serviceLayer()")
    public Object logAround(ProceedingJoinPoint joinPoint) throws Throwable {
        long start = System.currentTimeMillis();
        System.out.println("Start: " + joinPoint.getSignature().getName());
        
        Object result;
        try {
            result = joinPoint.proceed(); // call the actual method
        } finally {
            long elapsed = System.currentTimeMillis() - start;
            System.out.println("Time: " + elapsed + "ms");
        }
        
        return result;
    }
}
```

### Aspect
A class that combines pointcuts and advice.

### Weaving
The process of applying aspects to target objects. Spring AOP does this at **runtime** (not compile time like AspectJ).

---

## 7.3 JDK Dynamic Proxies vs CGLIB Proxies

This is where interviews get deep. Spring AOP works by creating a proxy of your bean.

### JDK Dynamic Proxy

- Used when the target bean **implements at least one interface**
- The proxy implements the same interface(s)
- Uses `java.lang.reflect.Proxy`

```java
public interface PaymentService {
    void charge(Order order);
}

@Service
public class StripePaymentService implements PaymentService {
    public void charge(Order order) { ... }
}

// Spring creates:
// Proxy implements PaymentService
// Proxy.charge() -> applies advice -> delegates to StripePaymentService.charge()
```

### CGLIB Proxy

- Used when the target bean **does NOT implement an interface** (or when `proxyTargetClass = true`)
- Creates a **subclass** of the target class at runtime
- Intercepts method calls via method overriding

```java
@Service
public class ReportService { // no interface
    public void generateReport() { ... }
}

// Spring creates:
// CGLIBProxy extends ReportService
// CGLIBProxy.generateReport() -> applies advice -> super.generateReport()
```

### Proxy Selection Rules:

```
Target implements interface(s)?
  ├── YES: Use JDK Dynamic Proxy (default)
  └── NO: Use CGLIB

spring.aop.proxy-target-class=true?
  └── Always use CGLIB (even for interface-based beans)

@EnableAspectJAutoProxy(proxyTargetClass = true)?
  └── Always use CGLIB
```

**Spring Boot uses CGLIB by default** since Spring Boot 2.x.

### Limitations of Spring AOP:

1. **Only method execution join points** — can't intercept field access or constructor calls (AspectJ can)
2. **Only Spring-managed beans** — can't proxy POJOs you created with `new`
3. **Self-invocation problem** (critical!)

---

## 7.4 The Self-Invocation Problem

This is one of the most common Spring bugs.

```java
@Service
public class OrderService {

    @Transactional
    public void placeOrder(Order order) {
        // ... place order
        sendConfirmation(order); // internal method call
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void sendConfirmation(Order order) {
        // This @Transactional is IGNORED!
        // Because this is a direct method call, not going through the proxy
    }
}
```

**Why it happens:**

```
External caller → Proxy → placeOrder() (on real OrderService)
                                    ↓
                             this.sendConfirmation()  ← bypasses proxy!
```

When `placeOrder` calls `sendConfirmation` using `this`, it goes directly to the real object, bypassing the proxy. No AOP magic happens.

### Solutions:

```java
// Option 1: Inject self (ugly but works)
@Service
public class OrderService {
    
    @Autowired
    @Lazy
    private OrderService self; // inject the proxy of itself
    
    public void placeOrder(Order order) {
        self.sendConfirmation(order); // goes through proxy!
    }
}

// Option 2: Extract to separate bean
@Service
public class OrderService {
    @Autowired
    private ConfirmationService confirmationService;
    
    public void placeOrder(Order order) {
        confirmationService.sendConfirmation(order); // goes through proxy!
    }
}

// Option 3: Get proxy from AopContext (requires exposeProxy = true)
@EnableAspectJAutoProxy(exposeProxy = true)
// in your config

public void placeOrder(Order order) {
    ((OrderService) AopContext.currentProxy()).sendConfirmation(order);
}
```

**Best practice:** Extract the method to a separate Spring bean. It's the cleanest solution.

---

# TOPIC 8: Spring Transaction Management

---

## 8.1 Overview

Spring provides a consistent transaction abstraction over different transaction APIs (JDBC, JPA, Hibernate, JTA).

### Declarative Transactions (Preferred)

Let Spring manage transactions with `@Transactional`.

```java
@Service
public class BankService {

    @Transactional
    public void transfer(Account from, Account to, BigDecimal amount) {
        from.debit(amount);
        to.credit(amount);
        // If any exception occurs, the entire transaction is rolled back
    }
}
```

### Programmatic Transactions

Manually manage transactions in code.

```java
@Service
public class BankService {

    @Autowired
    private TransactionTemplate transactionTemplate;

    public void transfer(Account from, Account to, BigDecimal amount) {
        transactionTemplate.execute(status -> {
            from.debit(amount);
            to.credit(amount);
            return null;
        });
    }
}
```

---

## 8.2 PlatformTransactionManager

The central interface in Spring's transaction infrastructure.

```java
public interface PlatformTransactionManager {
    TransactionStatus getTransaction(TransactionDefinition definition);
    void commit(TransactionStatus status);
    void rollback(TransactionStatus status);
}
```

Different implementations for different technologies:

```java
// For JDBC / JdbcTemplate
@Bean
public PlatformTransactionManager transactionManager(DataSource dataSource) {
    return new DataSourceTransactionManager(dataSource);
}

// For JPA / Hibernate
@Bean
public PlatformTransactionManager transactionManager(EntityManagerFactory emf) {
    return new JpaTransactionManager(emf);
}

// For distributed/multi-resource transactions
@Bean
public PlatformTransactionManager transactionManager() {
    return new JtaTransactionManager(); // uses JTA/XA
}
```

---

## 8.3 @Transactional Behavior

```java
@Transactional(
    propagation = Propagation.REQUIRED,      // default
    isolation = Isolation.DEFAULT,            // default
    timeout = 30,                             // seconds, -1 = no timeout
    readOnly = false,                         // hint for optimization
    rollbackFor = {Exception.class},          // roll back for these
    noRollbackFor = {IllegalArgumentException.class} // don't roll back for these
)
public void businessOperation() { ... }
```

---

## 8.4 Propagation Types

Propagation defines what happens when a transactional method is called within an existing transaction.

```java
// REQUIRED (default) — join existing transaction or create new one
@Transactional(propagation = Propagation.REQUIRED)
public void methodA() {
    // If called within a transaction, joins it
    // If called without a transaction, creates a new one
}

// REQUIRES_NEW — always create a new transaction, suspend existing one
@Transactional(propagation = Propagation.REQUIRES_NEW)
public void auditLog(String message) {
    // Even if caller rolls back, this audit entry is committed separately
    auditRepo.save(new AuditLog(message));
}

// NESTED — nested transaction (savepoint), rolls back to savepoint on failure
@Transactional(propagation = Propagation.NESTED)
public void nestedOperation() { ... }

// SUPPORTS — runs within transaction if one exists, otherwise non-transactional
@Transactional(propagation = Propagation.SUPPORTS)
public List<Order> findOrders() { ... } // read-only, doesn't need a tx

// NOT_SUPPORTED — always runs non-transactionally, suspends existing transaction
@Transactional(propagation = Propagation.NOT_SUPPORTED)
public void nonTransactionalOp() { ... }

// MANDATORY — must be called within existing transaction, else exception
@Transactional(propagation = Propagation.MANDATORY)
public void mustBeInTransaction() { ... }

// NEVER — must NOT be called within a transaction, else exception
@Transactional(propagation = Propagation.NEVER)
public void mustNotBeInTransaction() { ... }
```

---

## 8.5 Isolation Levels

Isolation controls what data a transaction can see from concurrent transactions.

```java
@Transactional(isolation = Isolation.READ_UNCOMMITTED)
// Can read uncommitted changes (dirty reads). Fastest, least safe.

@Transactional(isolation = Isolation.READ_COMMITTED)
// Only reads committed data. Prevents dirty reads. Default in most databases.

@Transactional(isolation = Isolation.REPEATABLE_READ)
// Same query returns same results within the same transaction.
// Prevents dirty reads and non-repeatable reads.

@Transactional(isolation = Isolation.SERIALIZABLE)
// Full isolation. Transactions run as if sequential. Slowest, safest.
```

| Level | Dirty Read | Non-Repeatable Read | Phantom Read |
|---|---|---|---|
| READ_UNCOMMITTED | ✅ Possible | ✅ Possible | ✅ Possible |
| READ_COMMITTED | ❌ Prevented | ✅ Possible | ✅ Possible |
| REPEATABLE_READ | ❌ Prevented | ❌ Prevented | ✅ Possible |
| SERIALIZABLE | ❌ Prevented | ❌ Prevented | ❌ Prevented |

---

## 8.6 Rollback Rules

**By default**, Spring only rolls back for **unchecked exceptions** (`RuntimeException` and its subclasses) and `Error`. Checked exceptions do NOT trigger rollback by default.

```java
@Transactional
public void processOrder(Order order) throws OrderException {
    // If OrderException (checked) is thrown — NO rollback by default!
    // If RuntimeException is thrown — rollback happens
}

// To rollback on checked exception:
@Transactional(rollbackFor = OrderException.class)
public void processOrder(Order order) throws OrderException {
    // Now rolls back for OrderException too
}

// To NOT rollback even for unchecked exception:
@Transactional(noRollbackFor = OptimisticLockingFailureException.class)
public void processOrder(Order order) {
    // Won't rollback for this specific exception
}
```

---

## 8.7 Common Transaction Pitfalls

### Pitfall 1: Self-invocation (same as AOP self-invocation)
```java
@Service
public class OrderService {
    public void placeOrder(Order order) {
        saveOrder(order); // @Transactional ignored — not through proxy!
    }

    @Transactional
    public void saveOrder(Order order) { ... }
}
```

### Pitfall 2: @Transactional on private methods
```java
@Service
public class OrderService {
    @Transactional
    private void internalSave(Order order) { // IGNORED — proxies can't intercept private!
        ...
    }
}
```

### Pitfall 3: Exception swallowed prevents rollback
```java
@Transactional
public void processOrder(Order order) {
    try {
        riskyOperation();
    } catch (Exception e) {
        log.error("Error", e); // exception swallowed! Transaction COMMITS even on error!
    }
}
```

### Pitfall 4: readOnly = true used for write operations
```java
@Transactional(readOnly = true)
public void updateUser(User user) {
    // readOnly = true sends a hint to DB — writes may be ignored or fail
    userRepo.save(user); // may not work!
}
```

---

# TOPIC 9: Spring MVC Internals

---

## 9.1 DispatcherServlet — The Front Controller

Spring MVC is built around the `DispatcherServlet`, which implements the **Front Controller pattern**. Every incoming HTTP request goes through it.

### Complete Request Processing Flow:

```
HTTP Request
    ↓
DispatcherServlet
    ↓
1. HandlerMapping.getHandler()
   → Returns HandlerExecutionChain (handler + interceptors)
    ↓
2. Interceptor.preHandle() for each interceptor
    ↓
3. HandlerAdapter.handle()
   → Resolves method arguments (ArgumentResolvers)
   → Invokes controller method
   → Processes return value (ReturnValueHandlers)
    ↓
4. Interceptor.postHandle()
    ↓
5. ViewResolver.resolveViewName() (if returning view name)
    ↓
6. View.render() (if applicable)
    ↓
7. Interceptor.afterCompletion()
    ↓
HTTP Response
```

---

## 9.2 HandlerMapping

Determines which controller method handles a given request.

```java
// Built-in HandlerMappings (Spring registers these automatically):
// 1. RequestMappingHandlerMapping — handles @RequestMapping, @GetMapping, etc.
// 2. BeanNameUrlHandlerMapping — maps URLs to bean names
// 3. RouterFunctionMapping — for WebFlux-style functional endpoints
```

```java
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @GetMapping("/{id}")
    public Order getOrder(@PathVariable Long id) { ... }

    @PostMapping
    public Order createOrder(@RequestBody OrderRequest request) { ... }
}
// RequestMappingHandlerMapping maps:
// GET /api/orders/{id} → getOrder()
// POST /api/orders → createOrder()
```

---

## 9.3 HandlerAdapter

Handles the actual invocation of the handler (controller method).

```java
// Main implementation: RequestMappingHandlerAdapter
// It knows how to invoke @RequestMapping-annotated methods
// It delegates to:
// - ArgumentResolvers to prepare method parameters
// - ReturnValueHandlers to process method return values
```

---

## 9.4 Argument Resolvers

`HandlerMethodArgumentResolver` implementations automatically convert HTTP request data into method parameters.

```java
@GetMapping("/orders")
public List<Order> getOrders(
    @RequestParam String status,           // PathVariableMethodArgumentResolver
    @PathVariable Long customerId,         // RequestParamMethodArgumentResolver
    @RequestBody OrderFilter filter,       // RequestResponseBodyMethodProcessor
    @RequestHeader("Authorization") String token, // RequestHeaderMethodArgumentResolver
    HttpServletRequest request,            // ServletRequestMethodArgumentResolver
    Principal principal,                   // PrincipalMethodArgumentResolver
    @Valid @RequestBody CreateOrderDto dto, // with validation
    BindingResult bindingResult            // must immediately follow @Valid param
) { ... }
```

You can write **custom argument resolvers**:

```java
public class CurrentUserArgumentResolver implements HandlerMethodArgumentResolver {

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.hasParameterAnnotation(CurrentUser.class)
               && parameter.getParameterType().equals(User.class);
    }

    @Override
    public Object resolveArgument(MethodParameter parameter,
                                  ModelAndViewContainer mavContainer,
                                  NativeWebRequest webRequest,
                                  WebDataBinderFactory binderFactory) {
        // extract user from SecurityContext or session
        return SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }
}
```

---

## 9.5 ViewResolver

Resolves view names (strings returned from controllers) to actual `View` objects.

```java
// Controller returns view name
@Controller
public class HomeController {
    @GetMapping("/home")
    public String home(Model model) {
        model.addAttribute("message", "Welcome!");
        return "home"; // view name — not a file path
    }
}

// ViewResolver (e.g., ThymeleafViewResolver) resolves "home"
// to templates/home.html
```

```java
// Common ViewResolvers:
// InternalResourceViewResolver → resolves to JSP files
// ThymeleafViewResolver → resolves to Thymeleaf templates
// FreeMarkerViewResolver → resolves to FreeMarker templates

// Configuration
@Bean
public InternalResourceViewResolver viewResolver() {
    InternalResourceViewResolver resolver = new InternalResourceViewResolver();
    resolver.setPrefix("/WEB-INF/views/");
    resolver.setSuffix(".jsp");
    return resolver;
}
// "home" → /WEB-INF/views/home.jsp
```

---

## 9.6 Filters vs Interceptors

Both intercept request processing, but at different levels.

### Filters (Servlet-level)

```java
@Component
public class RequestLoggingFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest req = (HttpServletRequest) request;
        System.out.println("Incoming: " + req.getMethod() + " " + req.getRequestURI());

        chain.doFilter(request, response); // continue chain

        System.out.println("Outgoing: " + ((HttpServletResponse) response).getStatus());
    }
}
```

**Filters:**
- Part of the Servlet specification — not Spring-specific
- Operate on raw `HttpServletRequest`/`HttpServletResponse`
- Can intercept ALL requests (static resources, non-Spring endpoints)
- Applied before `DispatcherServlet`
- Cannot access Spring beans directly (but Spring's `DelegatingFilterProxy` bridges this)

### Interceptors (Spring MVC-level)

```java
@Component
public class AuthenticationInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        // Return true to continue, false to abort
        String token = request.getHeader("Authorization");
        if (token == null) {
            response.setStatus(401);
            return false; // stop processing
        }
        return true;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response,
                           Object handler, ModelAndView modelAndView) {
        // After controller, before view rendering
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response,
                                Object handler, Exception ex) {
        // After everything — good for cleanup, logging
    }
}
```

Registering interceptors:

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Autowired
    private AuthenticationInterceptor authInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(authInterceptor)
                .addPathPatterns("/api/**")
                .excludePathPatterns("/api/public/**");
    }
}
```

| Aspect | Filter | Interceptor |
|---|---|---|
| Spec | Servlet API | Spring MVC |
| Scope | All requests | Only Spring MVC requests |
| Access to handler | ❌ | ✅ |
| Spring beans | Via DelegatingFilterProxy | ✅ Direct |
| Position | Before DispatcherServlet | Inside DispatcherServlet |
| Use case | Auth, CORS, encoding, security | Logging, auth, pre/post processing |

---

## 9.7 Exception Resolvers and @ControllerAdvice

### HandlerExceptionResolver

```java
// Spring's built-in exception resolvers:
// 1. ExceptionHandlerExceptionResolver — processes @ExceptionHandler methods
// 2. ResponseStatusExceptionResolver — processes @ResponseStatus annotations
// 3. DefaultHandlerExceptionResolver — handles Spring MVC exceptions
```

### @ControllerAdvice

Global exception handling across all controllers:

```java
@RestControllerAdvice // = @ControllerAdvice + @ResponseBody
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleNotFound(ResourceNotFoundException ex) {
        return new ErrorResponse("NOT_FOUND", ex.getMessage());
    }

    @ExceptionHandler(ValidationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleValidation(ValidationException ex) {
        return new ErrorResponse("VALIDATION_FAILED", ex.getMessage());
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorResponse handleGeneral(Exception ex) {
        return new ErrorResponse("INTERNAL_ERROR", "Something went wrong");
    }
}
```

---

# TOPIC 10: Validation and Error Handling

---

## 10.1 Bean Validation (JSR 380)

Spring integrates with **Jakarta Bean Validation** (formerly JSR-303/380).

```java
public class CreateOrderRequest {

    @NotNull(message = "Customer ID is required")
    private Long customerId;

    @NotEmpty(message = "Items cannot be empty")
    @Size(min = 1, max = 50, message = "Between 1 and 50 items")
    private List<OrderItem> items;

    @DecimalMin(value = "0.01", message = "Amount must be positive")
    @DecimalMax(value = "10000.00", message = "Amount cannot exceed 10000")
    private BigDecimal totalAmount;

    @Email(message = "Invalid email")
    private String email;

    @Future(message = "Delivery date must be in the future")
    private LocalDate deliveryDate;

    @Pattern(regexp = "^[A-Z]{2}\\d{6}$", message = "Invalid order code format")
    private String orderCode;
}
```

---

## 10.2 Validation Flow in Spring MVC

```java
@RestController
public class OrderController {

    @PostMapping("/orders")
    public ResponseEntity<Order> createOrder(
            @Valid @RequestBody CreateOrderRequest request,
            BindingResult result) { // capture errors without exception

        if (result.hasErrors()) {
            // handle errors manually
            List<String> errors = result.getFieldErrors().stream()
                    .map(e -> e.getField() + ": " + e.getDefaultMessage())
                    .collect(Collectors.toList());
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(orderService.create(request));
    }

    // OR — without BindingResult, Spring throws MethodArgumentNotValidException
    @PostMapping("/orders/v2")
    public Order createOrderV2(@Valid @RequestBody CreateOrderRequest request) {
        return orderService.create(request); // exception thrown if invalid
    }
}
```

---

## 10.3 Custom Validators

```java
// 1. Create the annotation
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = UniqueEmailValidator.class)
public @interface UniqueEmail {
    String message() default "Email already exists";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

// 2. Create the validator
@Component
public class UniqueEmailValidator implements ConstraintValidator<UniqueEmail, String> {

    @Autowired
    private UserRepository userRepository;

    @Override
    public boolean isValid(String email, ConstraintValidatorContext context) {
        if (email == null) return true; // let @NotNull handle null
        return !userRepository.existsByEmail(email);
    }
}

// 3. Use it
public class RegisterRequest {
    @NotNull
    @Email
    @UniqueEmail
    private String email;
}
```

---

## 10.4 Global Exception Handling and Error Response Design

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    // Handle validation errors
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleValidationErrors(MethodArgumentNotValidException ex) {
        Map<String, String> fieldErrors = ex.getBindingResult().getFieldErrors()
                .stream()
                .collect(Collectors.toMap(
                        FieldError::getField,
                        FieldError::getDefaultMessage,
                        (first, second) -> first
                ));
        return new ErrorResponse("VALIDATION_FAILED", "Input validation failed", fieldErrors);
    }

    // Handle constraint violations (method parameters)
    @ExceptionHandler(ConstraintViolationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleConstraintViolation(ConstraintViolationException ex) {
        List<String> errors = ex.getConstraintViolations().stream()
                .map(v -> v.getPropertyPath() + ": " + v.getMessage())
                .collect(Collectors.toList());
        return new ErrorResponse("CONSTRAINT_VIOLATED", errors.toString());
    }
}

// Standard error response structure
public class ErrorResponse {
    private String code;
    private String message;
    private Map<String, String> details;
    private Instant timestamp = Instant.now();
    private String traceId; // for correlation
}
```

---

# TOPIC 11: Spring Security (Architecture Level)

---

## 11.1 Security Filter Chain

Spring Security operates as a chain of servlet filters. Every HTTP request passes through this chain.

```
HTTP Request
    ↓
SecurityFilterChain
    ├── DisableEncodeUrlFilter
    ├── WebAsyncManagerIntegrationFilter
    ├── SecurityContextPersistenceFilter  ← loads SecurityContext from session/store
    ├── HeaderWriterFilter                ← writes security headers (HSTS, X-Frame-Options)
    ├── CorsFilter
    ├── CsrfFilter                        ← CSRF protection
    ├── LogoutFilter
    ├── UsernamePasswordAuthenticationFilter  ← form login
    ├── BasicAuthenticationFilter             ← Basic Auth
    ├── BearerTokenAuthenticationFilter      ← JWT/OAuth2
    ├── RequestCacheAwareFilter
    ├── SecurityContextHolderAwareRequestFilter
    ├── AnonymousAuthenticationFilter     ← anonymous user for unauthenticated requests
    ├── SessionManagementFilter
    ├── ExceptionTranslationFilter        ← converts auth exceptions to HTTP responses
    └── FilterSecurityInterceptor         ← access control decision
    ↓
DispatcherServlet (Spring MVC)
```

---

## 11.2 Authentication vs Authorization

### Authentication — "Who are you?"

```java
// The authentication process:
// 1. User submits credentials
// 2. AuthenticationManager.authenticate(Authentication) is called
// 3. Delegates to AuthenticationProvider (e.g., DaoAuthenticationProvider)
// 4. DaoAuthenticationProvider calls UserDetailsService.loadUserByUsername()
// 5. Compares provided password with stored hash
// 6. Returns authenticated Authentication object
// 7. Stored in SecurityContextHolder
```

### Authorization — "Are you allowed to do this?"

```java
// After authentication, Spring checks:
// 1. URL-based rules (@EnableWebSecurity)
// 2. Method-level rules (@PreAuthorize, @Secured)
// 3. Object-level rules (Spring Security ACL)
```

---

## 11.3 SecurityContext and SecurityContextHolder

```java
// SecurityContext holds the Authentication object for the current request
// SecurityContextHolder provides access to it (thread-local by default)

// Getting the current user anywhere in your code:
Authentication auth = SecurityContextHolder.getContext().getAuthentication();
String username = auth.getName();
Object principal = auth.getPrincipal(); // often a UserDetails object
Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();

// More type-safe:
UserDetails user = (UserDetails) auth.getPrincipal();

// Or inject directly into controller methods:
@GetMapping("/profile")
public UserProfile getProfile(@AuthenticationPrincipal UserDetails user) {
    return userService.getProfile(user.getUsername());
}
```

---

## 11.4 UserDetailsService

```java
// The core interface for loading user data
@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getUsername())
                .password(user.getPasswordHash())
                .roles(user.getRoles().toArray(new String[0]))
                .accountExpired(!user.isActive())
                .credentialsExpired(user.isPasswordExpired())
                .disabled(!user.isEnabled())
                .build();
    }
}
```

---

## 11.5 Security Configuration

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity // enables @PreAuthorize, @PostAuthorize
public class SecurityConfig {

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/public/**", "/auth/**").permitAll()
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE).hasAuthority("PERM_DELETE")
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS) // for REST/JWT
            )
            .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class)
            .csrf(csrf -> csrf.disable()) // for REST APIs
            .cors(cors -> cors.configurationSource(corsConfigurationSource()));

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
```

---

## 11.6 Method-Level Security

```java
@Service
public class DocumentService {

    @PreAuthorize("hasRole('ADMIN') or hasAuthority('DOCUMENT_READ')")
    public List<Document> getAllDocuments() { ... }

    @PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal.id")
    public Document getDocument(Long userId, Long documentId) { ... }

    @PostAuthorize("returnObject.owner == authentication.name")
    public Document findDocument(Long id) { ... }

    @Secured({"ROLE_ADMIN", "ROLE_MANAGER"})
    public void deleteDocument(Long id) { ... }
}
```

---

## 11.7 Common Security Misconfigurations

```java
// WRONG — too permissive
.anyRequest().permitAll()

// WRONG — password stored in plain text
@Bean
public PasswordEncoder encoder() { return NoOpPasswordEncoder.getInstance(); }

// WRONG — CSRF disabled for everything (including browser apps)
.csrf(csrf -> csrf.disable())

// WRONG — session fixation not handled
// WRONG — no rate limiting on login endpoint
// WRONG — JWT secret too short or hardcoded
// WRONG — sensitive data in URL parameters (logged in access logs)
```

---

# TOPIC 12: Configuration and Environment Management

---

## 12.1 Application Properties

```properties
# application.properties
server.port=8080
spring.datasource.url=jdbc:mysql://localhost:3306/mydb
spring.datasource.username=root
spring.datasource.password=secret
app.feature.dark-mode=true
app.max-retries=3
```

```yaml
# application.yml (equivalent)
server:
  port: 8080
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/mydb
    username: root
    password: secret
app:
  feature:
    dark-mode: true
  max-retries: 3
```

Accessing properties:

```java
@Value("${app.max-retries}")
private int maxRetries;

@Value("${app.feature.dark-mode:false}") // with default value
private boolean darkMode;

// Type-safe configuration binding
@ConfigurationProperties(prefix = "app")
@Component
public class AppProperties {
    private int maxRetries;
    private Feature feature;

    public static class Feature {
        private boolean darkMode;
        // getters/setters
    }
    // getters/setters
}
```

---

## 12.2 Profiles

Profiles allow different configurations for different environments.

```properties
# application.properties (common)
app.name=MyApp

# application-dev.properties
spring.datasource.url=jdbc:h2:mem:devdb
logging.level.root=DEBUG

# application-prod.properties  
spring.datasource.url=jdbc:mysql://prod-server/mydb
logging.level.root=WARN
```

```java
// Profile-specific beans
@Configuration
@Profile("dev")
public class DevDataSourceConfig {
    @Bean
    public DataSource dataSource() {
        return new EmbeddedDatabaseBuilder().setType(EmbeddedDatabaseType.H2).build();
    }
}

@Configuration
@Profile("prod")
public class ProdDataSourceConfig {
    @Bean
    public DataSource dataSource() {
        // Real production data source
        return createHikariDataSource();
    }
}

// Activating a profile:
// 1. application.properties: spring.profiles.active=dev
// 2. JVM arg: -Dspring.profiles.active=prod
// 3. Environment variable: SPRING_PROFILES_ACTIVE=prod
// 4. Programmatically:
ctx.getEnvironment().setActiveProfiles("dev");
```

---

## 12.3 Property Sources

Spring resolves properties from multiple sources in this priority order (higher overrides lower):

```
1. Command-line arguments               (--server.port=9090)
2. SPRING_APPLICATION_JSON env var
3. OS environment variables             (SPRING_DATASOURCE_URL=...)
4. JVM system properties               (-Dserver.port=9090)
5. application-{profile}.properties
6. application.properties
7. @PropertySource annotations
8. Default values in @Value
```

```java
// Custom property source
@Configuration
@PropertySource("classpath:custom.properties")
@PropertySource("file:/etc/myapp/secrets.properties")
public class PropertyConfig { }
```

---

## 12.4 Environment Abstraction

```java
@Component
public class EnvironmentInspector {

    @Autowired
    private Environment env;

    public void inspect() {
        // Get any property
        String dbUrl = env.getProperty("spring.datasource.url");
        int port = env.getProperty("server.port", Integer.class, 8080);

        // Check active profiles
        String[] activeProfiles = env.getActiveProfiles();
        boolean isProd = env.acceptsProfiles(Profiles.of("prod"));

        // Check if property exists
        boolean hasKey = env.containsProperty("app.feature.enabled");
    }
}
```

---

## 12.5 Secrets Handling

```java
// Never hardcode secrets. Approaches:
// 1. Environment variables (most common in containers/K8s)
spring.datasource.password=${DB_PASSWORD}

// 2. External config servers (Spring Cloud Config)
spring.config.import=configserver:http://config-server:8888

// 3. Vault integration (Spring Cloud Vault)
spring.config.import=vault://

// 4. Kubernetes secrets mounted as files
spring.config.location=file:/secrets/

// 5. AWS Secrets Manager / Azure Key Vault (via Spring Cloud AWS/Azure)
```

---

# TOPIC 13: Spring Boot

---

## 13.1 Spring vs Spring Boot

| Aspect | Spring | Spring Boot |
|---|---|---|
| Setup | Manual configuration | Auto-configuration |
| Web server | External (deploy WAR) | Embedded (Tomcat/Jetty/Undertow) |
| Dependencies | Manual JAR management | Starter POMs handle versions |
| Configuration | Much manual config | Sensible defaults, override as needed |
| Production-ready | Manual setup | Actuator included |
| Entry point | `ApplicationContext.refresh()` | `SpringApplication.run()` |

---

## 13.2 Auto-Configuration Mechanism

This is how Spring Boot works its "magic."

When you add `spring-boot-starter-data-jpa` to your classpath, Spring Boot automatically configures:
- `DataSource`
- `EntityManagerFactory`
- `TransactionManager`
- Spring Data repositories

### How It Works:

```java
// @SpringBootApplication = @Configuration + @ComponentScan + @EnableAutoConfiguration
@SpringBootApplication
public class MyApp {
    public static void main(String[] args) {
        SpringApplication.run(MyApp.class, args);
    }
}
```

`@EnableAutoConfiguration` triggers auto-configuration by importing `AutoConfigurationImportSelector`.

```
1. Spring Boot reads META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports
   (or in older versions: META-INF/spring.factories)
2. This file lists all auto-configuration classes
3. Each auto-configuration class is annotated with @Conditional annotations
4. Only those matching all conditions are applied
```

```java
// Example: DataSourceAutoConfiguration (simplified)
@AutoConfiguration
@ConditionalOnClass({ DataSource.class, EmbeddedDatabaseType.class })
@ConditionalOnMissingBean(type = "io.r2dbc.spi.ConnectionFactory")
@EnableConfigurationProperties(DataSourceProperties.class)
@Import({ DataSourcePoolMetadataProvidersConfiguration.class, DataSourceInitializationConfiguration.class })
public class DataSourceAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean  // ONLY if you haven't defined your own DataSource
    public DataSource dataSource(DataSourceProperties properties) {
        return createDataSource(properties);
    }
}
```

---

## 13.3 Conditional Annotations

These are the key to understanding auto-configuration:

```java
@ConditionalOnClass(DataSource.class)          // only if this class is on classpath
@ConditionalOnMissingClass("com.example.Foo")  // only if this class is NOT on classpath
@ConditionalOnBean(DataSource.class)           // only if this bean exists
@ConditionalOnMissingBean(DataSource.class)    // only if this bean does NOT exist (most important!)
@ConditionalOnProperty(name = "feature.enabled", havingValue = "true")  // only if property matches
@ConditionalOnWebApplication                   // only in web app context
@ConditionalOnNotWebApplication                // only in non-web context
@ConditionalOnExpression("${feature.enabled:false}")  // SpEL condition
@ConditionalOnResource(resources = "classpath:schema.sql") // only if resource exists
```

**`@ConditionalOnMissingBean` is the most important one** — it means "provide this if the user hasn't provided their own." This is what allows you to override auto-configured beans.

```java
// You can always override auto-configuration by defining your own bean:
@Bean  // your custom DataSource replaces the auto-configured one
public DataSource dataSource() {
    return myCustomDataSource();
}
```

---

## 13.4 Starter Dependencies

Starters are pre-packaged dependency bundles with compatible versions.

```xml
<!-- This one dependency brings in JPA, Hibernate, DataSource, transactions -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>

<!-- Web starter: Spring MVC, Tomcat, Jackson, validation -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<!-- Security starter -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

---

## 13.5 Boot Lifecycle vs Spring Lifecycle

```
SpringApplication.run(MyApp.class, args)
    ↓
1. Create SpringApplication instance
2. Determine application type (SERVLET, REACTIVE, NONE)
3. Load SpringApplicationRunListeners (from spring.factories)
4. Publish ApplicationStartingEvent
5. Prepare Environment (load properties, profiles)
6. Publish ApplicationEnvironmentPreparedEvent
7. Create ApplicationContext (based on app type)
8. Prepare ApplicationContext
    - Apply initializers
    - Load bean definitions from @SpringBootApplication class
9. Refresh ApplicationContext (standard Spring lifecycle begins here!)
    - BeanDefinitionRegistryPostProcessor
    - BeanFactoryPostProcessor
    - Bean instantiation, DI, lifecycle callbacks
10. Publish ApplicationStartedEvent
11. Run ApplicationRunner / CommandLineRunner beans
12. Publish ApplicationReadyEvent
    ↓
Application is ready to serve requests
```

```java
// Run code after startup
@Component
public class StartupRunner implements ApplicationRunner {
    @Override
    public void run(ApplicationArguments args) throws Exception {
        System.out.println("Application started! Warm up cache...");
    }
}

// Or listen to events
@EventListener(ApplicationReadyEvent.class)
public void onReady() {
    System.out.println("App is ready!");
}
```

---

# TOPIC 14: Advanced Spring Topics

---

## 14.1 Application Events

Spring has a built-in event system. You can publish and listen to events.

```java
// 1. Define event
public class OrderPlacedEvent extends ApplicationEvent {
    private final Order order;

    public OrderPlacedEvent(Object source, Order order) {
        super(source);
        this.order = order;
    }

    public Order getOrder() { return order; }
}

// 2. Publish event
@Service
public class OrderService {

    @Autowired
    private ApplicationEventPublisher eventPublisher;

    @Transactional
    public Order placeOrder(OrderRequest request) {
        Order order = createOrder(request);
        orderRepository.save(order);
        
        // Publish after transaction commits
        eventPublisher.publishEvent(new OrderPlacedEvent(this, order));
        
        return order;
    }
}

// 3. Listen to event
@Component
public class EmailNotificationListener {

    @EventListener
    public void handleOrderPlaced(OrderPlacedEvent event) {
        emailService.sendConfirmation(event.getOrder());
    }

    // Async listener
    @Async
    @EventListener
    public void handleOrderPlacedAsync(OrderPlacedEvent event) {
        // Runs in a separate thread
        analyticsService.recordOrderPlaced(event.getOrder());
    }

    // Conditional listener
    @EventListener(condition = "#event.order.totalAmount > 1000")
    public void handleHighValueOrder(OrderPlacedEvent event) {
        fraudDetectionService.check(event.getOrder());
    }
}
```

### Transaction-Bound Events

```java
// Only send email AFTER transaction commits
@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
public void handleOrderPlaced(OrderPlacedEvent event) {
    emailService.sendConfirmation(event.getOrder());
    // If we sent this inside @EventListener and the transaction rolled back,
    // we'd send a confirmation for a failed order!
}
```

---

## 14.2 Context Hierarchy (Parent/Child Contexts)

Spring MVC applications traditionally have two application contexts:

```
Root ApplicationContext (parent)
├── Service beans
├── Repository beans
├── DataSource, TransactionManager
├── Security config
└── Everything not web-specific

    ↑ child can see parent's beans
    
Web ApplicationContext (child)
├── Controllers
├── ViewResolvers
├── HandlerMappings
└── Web-specific beans
```

```java
// Parent context — typically loaded by ContextLoaderListener
@Configuration
@ComponentScan(basePackages = "com.example.service,com.example.repo")
public class RootConfig { }

// Child context — loaded by DispatcherServlet
@Configuration
@ComponentScan(basePackages = "com.example.web")
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer { }
```

**In Spring Boot:** The context hierarchy is flattened — there's usually just one `ApplicationContext`. Spring Boot automatically configures everything in a single context.

---

## 14.3 Async Execution

```java
@Configuration
@EnableAsync
public class AsyncConfig implements AsyncConfigurer {

    @Override
    public Executor getAsyncExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(10);
        executor.setMaxPoolSize(50);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("Async-");
        executor.initialize();
        return executor;
    }

    @Override
    public AsyncUncaughtExceptionHandler getAsyncUncaughtExceptionHandler() {
        return (ex, method, params) -> {
            log.error("Async exception in " + method.getName(), ex);
        };
    }
}

@Service
public class ReportService {

    @Async
    public CompletableFuture<Report> generateReportAsync(Long reportId) {
        // Runs in thread pool, not in calling thread
        Report report = generateExpensiveReport(reportId);
        return CompletableFuture.completedFuture(report);
    }
}

// Calling it:
CompletableFuture<Report> future = reportService.generateReportAsync(123L);
// do other work...
Report report = future.get(); // wait for result
```

**Important:** `@Async` suffers from the same self-invocation problem as AOP — calling an `@Async` method from within the same class won't work asynchronously.

---

## 14.4 Testing with Spring

### Test Slices

Spring Boot provides "slices" that load only the parts of the context needed for a specific test type:

```java
// @WebMvcTest — only web layer (controllers, filters, converters)
@WebMvcTest(OrderController.class)
class OrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean  // Mock in Spring context
    private OrderService orderService;

    @Test
    void createOrder_validRequest_returns201() throws Exception {
        when(orderService.create(any())).thenReturn(testOrder());

        mockMvc.perform(post("/api/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"customerId": 1, "items": [...]}"""))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists());
    }
}

// @DataJpaTest — only JPA layer (repositories, EntityManager)
@DataJpaTest
class OrderRepositoryTest {

    @Autowired
    private OrderRepository orderRepository;

    @Test
    void findByStatus_returnsMatchingOrders() {
        Order saved = orderRepository.save(new Order(Status.PENDING));
        List<Order> found = orderRepository.findByStatus(Status.PENDING);
        assertThat(found).contains(saved);
    }
}

// @SpringBootTest — full integration test
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class OrderIntegrationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void fullOrderFlow() {
        ResponseEntity<Order> response = restTemplate.postForEntity(
            "/api/orders", request, Order.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
    }
}
```

### Context Caching

Spring caches the `ApplicationContext` between tests with the same configuration. This dramatically speeds up test suites — the context is loaded once and reused.

```java
// Same context is reused for tests sharing the same config
@SpringBootTest
class Test1 { } // context loaded here

@SpringBootTest
class Test2 { } // same context reused — fast!

// Context is rebuilt if configuration differs:
@SpringBootTest(properties = "feature.enabled=true")
class Test3 { } // new context
```

### @MockBean vs Real Beans

```java
@SpringBootTest
class ServiceTest {

    @Autowired
    private OrderService orderService; // real bean

    @MockBean  // replaces the real PaymentService in the context with a Mockito mock
    private PaymentService paymentService;

    @SpyBean  // real bean, but with Mockito spy capabilities
    private EmailService emailService;

    @Test
    void placeOrder_chargesPayment() {
        when(paymentService.charge(any())).thenReturn(PaymentResult.SUCCESS);
        
        orderService.placeOrder(testOrder());
        
        verify(paymentService).charge(any());
        verify(emailService).sendConfirmation(any()); // real method called
    }
}
```

---

# TOPIC 15: Spring in Production

---

## 15.1 Spring Boot Actuator

Actuator provides production-ready features.

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

```properties
# application.properties
management.endpoints.web.exposure.include=health,info,metrics,loggers,env
management.endpoint.health.show-details=always
management.server.port=8081  # expose on different port for security
```

### Key Endpoints:

| Endpoint | Purpose |
|---|---|
| `/actuator/health` | Application health status |
| `/actuator/metrics` | JVM metrics, HTTP stats |
| `/actuator/info` | App info (version, git commit) |
| `/actuator/env` | Environment properties |
| `/actuator/loggers` | View/change log levels at runtime |
| `/actuator/threaddump` | Thread state snapshot |
| `/actuator/heapdump` | JVM heap dump |
| `/actuator/beans` | All Spring beans |
| `/actuator/mappings` | All HTTP request mappings |

---

## 15.2 Health Checks

```java
// Custom health indicator
@Component
public class DatabaseHealthIndicator implements HealthIndicator {

    @Autowired
    private DataSource dataSource;

    @Override
    public Health health() {
        try (Connection conn = dataSource.getConnection()) {
            if (conn.isValid(1)) {
                return Health.up()
                        .withDetail("database", "MySQL")
                        .withDetail("status", "Connected")
                        .build();
            }
        } catch (SQLException e) {
            return Health.down()
                    .withDetail("error", e.getMessage())
                    .build();
        }
        return Health.down().build();
    }
}

// Response:
// GET /actuator/health
// {
//   "status": "UP",
//   "components": {
//     "database": { "status": "UP", "details": { "database": "MySQL" } },
//     "diskSpace": { "status": "UP" }
//   }
// }
```

---

## 15.3 Graceful Shutdown

```properties
# application.properties
server.shutdown=graceful
spring.lifecycle.timeout-per-shutdown-phase=30s
```

With graceful shutdown:
1. When shutdown signal received (SIGTERM), the server stops accepting new requests
2. Existing in-flight requests are allowed to complete (up to 30s)
3. Then the application context closes (lifecycle callbacks, `@PreDestroy`, etc.)
4. JVM exits

---

## 15.4 Resource Cleanup

```java
@Component
public class ScheduledTaskManager implements DisposableBean {

    private final ScheduledExecutorService executor = Executors.newScheduledThreadPool(4);

    @PostConstruct
    public void startTasks() {
        executor.scheduleAtFixedRate(this::runTask, 0, 1, TimeUnit.MINUTES);
    }

    @PreDestroy // or implement DisposableBean.destroy()
    public void shutdown() {
        executor.shutdown();
        try {
            if (!executor.awaitTermination(30, TimeUnit.SECONDS)) {
                executor.shutdownNow();
            }
        } catch (InterruptedException e) {
            executor.shutdownNow();
            Thread.currentThread().interrupt();
        }
    }
}
```

---

## 15.5 Memory Leak Patterns in Spring Apps

### Pattern 1: ThreadLocal not cleared in thread pools

```java
// WRONG — ThreadLocal not cleared
@Component
public class RequestContextHolder {
    private static final ThreadLocal<RequestContext> context = new ThreadLocal<>();

    public void set(RequestContext ctx) { context.set(ctx); }
    public RequestContext get() { return context.get(); }
    // Missing: remove() call!
}

// Thread from pool retains context from previous request!

// RIGHT — always clear ThreadLocal
@Override
public void afterCompletion(HttpServletRequest request, ...) {
    context.remove(); // clean up in interceptor's afterCompletion
}
```

### Pattern 2: Prototype beans held by singleton beans

```java
// WRONG — prototype bean held by singleton
@Service // singleton
public class OrderService {
    @Autowired
    private LargePrototypeBean largeBean; // held forever in singleton's field
    // LargePrototypeBean is never garbage collected!
}
```

### Pattern 3: Caches without eviction

```java
// WRONG — unbounded in-memory cache
@Service
public class UserService {
    private final Map<Long, User> cache = new HashMap<>(); // grows forever!

    public User getUser(Long id) {
        return cache.computeIfAbsent(id, userRepository::findById);
    }
}

// RIGHT — use Spring's @Cacheable with proper eviction
@Cacheable(value = "users", key = "#id")
public User getUser(Long id) {
    return userRepository.findById(id).orElseThrow();
}

// And configure with size limits and TTL
@Bean
public CacheManager cacheManager() {
    CaffeineCacheManager manager = new CaffeineCacheManager("users");
    manager.setCaffeine(Caffeine.newBuilder()
        .maximumSize(1000)
        .expireAfterWrite(Duration.ofMinutes(30)));
    return manager;
}
```

### Pattern 4: Event listeners holding references

```java
// WRONG — anonymous listener registered but never unregistered
@PostConstruct
public void init() {
    applicationContext.addApplicationListener(event -> {
        // this lambda holds a reference to the outer class
        doSomething(); // outer class cannot be GC'd
    });
}

// RIGHT — use @EventListener (Spring manages its lifecycle)
@EventListener
public void handleEvent(MyEvent event) {
    doSomething();
}
```

### Pattern 5: Hibernate/JPA session leaks

```java
// WRONG — Open Session in View pattern can cause N+1 and memory issues in prod
spring.jpa.open-in-view=false  # always set this to false in production
```

---

## Summary: Key Interview Topics by Frequency

| Topic | Interview Weight |
|---|---|
| IoC, DI, Bean lifecycle | ⭐⭐⭐⭐⭐ |
| @Transactional pitfalls | ⭐⭐⭐⭐⭐ |
| AOP & self-invocation | ⭐⭐⭐⭐⭐ |
| Proxy types (JDK vs CGLIB) | ⭐⭐⭐⭐ |
| BeanPostProcessor | ⭐⭐⭐⭐ |
| @Configuration vs @Component | ⭐⭐⭐⭐ |
| Spring Boot auto-configuration | ⭐⭐⭐⭐ |
| Scope + scope proxying | ⭐⭐⭐⭐ |
| DispatcherServlet flow | ⭐⭐⭐ |
| Security filter chain | ⭐⭐⭐ |
| Transaction propagation | ⭐⭐⭐⭐ |
| Context caching in tests | ⭐⭐⭐ |

---

This completes all **15 topic areas** of the Spring Framework guide. Every concept has been covered from the ground up with code examples, internal mechanics, and interview-critical distinctions. Let me know if you want to dive deeper into any specific topic, do Q&A practice, or work through code-level exercises on any section.
