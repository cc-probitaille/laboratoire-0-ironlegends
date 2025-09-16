// Vous devez insérer les nouveaux tests ici
import { assert } from 'console';
import 'jest-extended';
import app from '../../src/app';
import request from 'supertest';

describe('redemarrerJeu.test.ts', () => {
  it("devrait implémenter test", async () => {
    throw new Error("Ce test n'a pas été défini")
  });

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
        .get('/api/v1/jeu/obtenirJoueurs');

      expect(response.status).toBe(200);
      expect(response.body.joueurs).toEqual([]);
    });
  });
});
