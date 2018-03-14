/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package licencias;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.util.HashMap;

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
            cstmt = con.prepareCall("{ call lic.alertaRenoSoporteSIN () }");
            System.out.println("Ejecutando:alertaRenoSoporteSIN");
            int cant= cstmt.executeUpdate();
            System.out.println("cant:"+cant);
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

    public HashMap obtieneBancos() throws Exception {
        HashMap hm = new HashMap();
        ResultSet rs = null;
        CallableStatement cstmt	= null;
        Connection con = null;
        try {
            con = DBConecction.getInstance().getConnection();
            cstmt = con.prepareCall("{ call lic.sololist () }");
            rs = cstmt.executeQuery();

            while (rs.next()) {
                System.out.println("Listando:" + rs.getString("nombre"));
                //hm.put(rs.getString("vcCodigo"), new Integer(rs.getInt("iIdBanco")));
            }
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
            try {
                if (rs != null) {
                    rs.close();
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return hm;
    }


}
