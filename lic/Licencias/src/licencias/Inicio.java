/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package licencias;

/**
 *
 * @author Ricardo Reyes
 */
public class Inicio {

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) {
        try {
           ProcesoDAO dao = new ProcesoDAO();
           dao.actualizaArchivo();
           dao.actualizaSIC();
        } catch (Exception e){
            e.printStackTrace();
        }
        System.out.println("Termino Proceso OK");
    }

}
