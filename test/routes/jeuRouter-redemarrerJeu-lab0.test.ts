// Vous devez insérer les nouveaux tests ici
import 'jest-extended';
import app from '../../src/app';
import request from 'supertest';
import {jeuRoutes} from "../../src/routes/jeuRouter";

describe('redemarrerJeu.test.ts', () => {

  describe('GET /api/v1/jeu/redemarrerJeu', () => {

    beforeAll(async () => {
      // Créer deux joueurs avant l'exécution des tests
      await request(app)
        .post('/api/v1/jeu/demarrerJeu')
        .send({ nom: 'Joueur1' });

      await request(app)
        .post('/api/v1/jeu/demarrerJeu')
        .send({ nom: 'Joueur2' });
    });

    it('devrait redémarrer le jeu avec succès', async () => {
      const response = await request(app)
        .get('/api/v1/jeu/redemarrerJeu');

      expect(response.status).toBe(200);
      expect(response.type).toBe('application/json');
    });

    it('devrait supprimer tous les joueurs (postcondition)', async () => {
      const response = await request(app)
        .get('/api/v1/jeu/redemarrerJeu');

      expect(response.status).toBe(200);
      expect(response.body.joueurs).toBe(undefined);
    });

      it('devrait permettre de créer de nouveaux joueurs après redémarrage', async () => {
          // Redémarrer le jeu
          await request(app)
              .get('/api/v1/jeu/redemarrerJeu');

          // Créer un nouveau joueur
          const response = await request(app)
              .post('/api/v1/jeu/demarrerJeu')
              .send({ nom: 'Joueur3' });

          expect(response.status).toBe(201);
          expect(response.body.joueur.nom).toBe('Joueur3');
      });

      it('devrait gérer les erreurs correctement', async () => {
          // Simuler une erreur en remplaçant temporairement la méthode redemarrerJeu
          const originalRedemarrerJeu = jeuRoutes.controleurJeu.redemarrerJeu;
          jeuRoutes.controleurJeu.redemarrerJeu = jest.fn().mockImplementation(() => {
              const error: any = new Error('Test error');
              error.code = 500;
              throw error;
          });

          const response = await request(app)
              .get('/api/v1/jeu/redemarrerJeu');

          expect(response.status).toBe(500);
          expect(response.body.error).toContain('Test error');

          // Restaurer la méthode originale
          jeuRoutes.controleurJeu.redemarrerJeu = originalRedemarrerJeu;
      });
  });
});
