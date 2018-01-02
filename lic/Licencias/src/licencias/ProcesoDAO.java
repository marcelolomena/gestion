/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package licencias;

import java.sql.CallableStatement;
import java.sql.Connection;

/**
 *
 * @author Ricardo Reyes
 */
public class ProcesoDAO {

    public void actualizaArchivo() throws Exception {
        CallableStatement cstmt	= null;
        Connection con = null;
        try {
            con = DBConecction.getInstance().getConnection();
            cstmt = con.prepareCall("{ call lic.alertaRenoSoporteSIN }");
            System.out.println("Ejecutando:alertaRenoSoporteSIN");
            cstmt.execute();
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
	} finally {
            try {
                if (con != null) {
                    con.close();
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
            try {
                if (cstmt != null) {
                    cstmt.close();
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

    }


}
