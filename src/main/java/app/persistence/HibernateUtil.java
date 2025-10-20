package app.persistence;

import app.model.ResultRecord;
import org.hibernate.SessionFactory;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.hibernate.cfg.Configuration;
import org.hibernate.cfg.Environment;
import org.hibernate.service.ServiceRegistry;

import java.util.Optional;

public final class HibernateUtil {

    private static final SessionFactory SESSION_FACTORY = buildSessionFactory();

    private HibernateUtil() {
    }

    private static SessionFactory buildSessionFactory() {
        try {
            Configuration configuration = new Configuration();
            configuration.configure();

            configuration.addAnnotatedClass(ResultRecord.class);

            overrideFromEnv(configuration, Environment.URL, "HIBERNATE_DB_URL");
            overrideFromEnv(configuration, Environment.USER, "HIBERNATE_DB_USERNAME");
            overrideFromEnv(configuration, Environment.PASS, "HIBERNATE_DB_PASSWORD");

            ServiceRegistry serviceRegistry = new StandardServiceRegistryBuilder()
                    .applySettings(configuration.getProperties())
                    .build();
            return configuration.buildSessionFactory(serviceRegistry);
        } catch (Throwable throwable) {
            System.err.println("Hibernate SessionFactory init failed: " + throwable.getMessage());
            throwable.printStackTrace();
            return null;
        }
    }

    private static void overrideFromEnv(Configuration configuration, String property, String envVariable) {
        Optional.ofNullable(System.getenv(envVariable))
                .filter(str -> !str.isBlank())
                .ifPresent(value -> configuration.setProperty(property, value));
        Optional.ofNullable(System.getProperty(property))
                .filter(str -> !str.isBlank())
                .ifPresent(value -> configuration.setProperty(property, value));
    }

    public static SessionFactory getSessionFactory() {
        return SESSION_FACTORY;
    }
}
