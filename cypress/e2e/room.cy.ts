
import { createClientMock } from '../support/clientMock'

describe('Test room page', () => {

    beforeEach(() => {

      window.localStorage.setItem('userName', 'toto')

      cy.visit('/room/test')
      cy.get('.user').contains('toto')
    })
  
    it('you can vote and unvote', () => {
      cy.get('[data-testid="selectCard1"]').contains('1').click()
      cy.get('.card.mine').contains('1').click().contains('1').should('not.exist')
    })
  
    it('you can see other user', () => {
       const user1 = createClientMock();
        user1.join('test')
        cy.get('.user-view > .el-row > .el-col').should('have.length', 2)
      cy.get('[data-testid="selectCard1"]').contains('1').click()
      cy.get('.card').contains('1').click().contains('1').should('not.exist')
    })
  
  })