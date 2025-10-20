package app.persistence;

import app.model.ResultRecord;
import org.hibernate.HibernateException;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.query.Query;

import java.util.Collections;
import java.util.List;
import java.util.function.Consumer;

public final class ResultRepository {

    private static final ResultRepository INSTANCE = new ResultRepository();

    private final SessionFactory sessionFactory;

    private ResultRepository() {
        this.sessionFactory = HibernateUtil.getSessionFactory();
    }

    public static ResultRepository getInstance() {
        return INSTANCE;
    }

    public boolean isAvailable() {
        return sessionFactory != null;
    }

    public List<ResultRecord> findBySessionId(String sessionId) {
        if (!isAvailable()) {
            return Collections.emptyList();
        }
        try (Session session = sessionFactory.openSession()) {
            Query<ResultRecord> query = session.createQuery(
                    "from ResultRecord where sessionId = :sessionId order by id asc",
                    ResultRecord.class
            );
            query.setParameter("sessionId", sessionId);
            return query.list();
        } catch (HibernateException ex) {
            throw new RepositoryException("Не удалось получить список результатов", ex);
        }
    }

    public void save(ResultRecord record) {
        executeInsideTransaction(session -> session.persist(record));
    }

    public void deleteBySessionId(String sessionId) {
        executeInsideTransaction(session -> session.createQuery(
                        "delete from ResultRecord where sessionId = :sessionId"
                )
                .setParameter("sessionId", sessionId)
                .executeUpdate());
    }

    private void executeInsideTransaction(Consumer<Session> action) {
        if (!isAvailable()) {
            throw new RepositoryException("Подключение к базе данных недоступно");
        }
        Transaction transaction = null;
        try (Session session = sessionFactory.openSession()) {
            transaction = session.beginTransaction();
            action.accept(session);
            transaction.commit();
        } catch (HibernateException ex) {
            if (transaction != null) {
                transaction.rollback();
            }
            throw new RepositoryException("Ошибка при работе с базой данных", ex);
        }
    }
}
