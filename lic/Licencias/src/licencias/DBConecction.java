/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package licencias;

import java.io.File;
import java.io.FileInputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.PropertyResourceBundle;
import java.util.ResourceBundle;

/**
 *
 * @author Ricardo Reyes
 */
public class DBConecction {

    private static DBConecction s_DBConnection;

    private DBConecction() {

    }

    /**
     * Inicia o retorna instancia de Singleton
     * @return Instancia de DBConecction
     */
    synchronized public static DBConecction getInstance() {
        if (s_DBConnection == null) {
            try {
                s_DBConnection = new DBConecction();
            } catch (Exception e) {
                throw new IllegalStateException("DBConecction no inicializado.");
            }
        }
        return s_DBConnection;
    }

    public Connection getConnection() throws SQLException {
        Connection connection = null;
        FileInputStream fis = null;
        try {
            String dirpath = System.getProperty("user.dir")+File.separator + "prop" + File.separator + "lic.properties" ;
            fis = new FileInputStream(dirpath);
            ResourceBundle bundle = new PropertyResourceBundle(fis);

            String driverClassName = "com.microsoft.sqlserver.jdbc.SQLServerDriver";
            String driverUrl = bundle.getString("urldb");
            Class.forName(driverClassName);
            connection = DriverManager.getConnection(driverUrl, bundle.getString("userdb"),
                    bundle.getString("pwddb"));
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                if (fis != null)
                    fis.close();
            } catch (Exception e){
                e.printStackTrace();
            }
        }
        return connection;
    }
}
