
import { io } from 'socket.io-client'
import  { v4 as uuidv4 }  from 'uuid'

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
  
    it('you can see other users', () => {
      const socketUser1 = io({port : 8080})  
      socketUser1.emit('setUserUUID', uuidv4())


      socketUser1.emit('setUserName', 'titi')
      socketUser1.emit('join', { roomId : 'test' })


      cy.get('.user-view > .el-row > .el-col').should('have.length', 2).contains('titi')
    //  const user2 = createClientMock('tata');
    //  user2.join('test')
    //  cy.get('.user-view > .el-row > .el-col').should('have.length', 3).contains('tata')
      socketUser1.disconnect()
      cy.get('.user-view > .el-row > .el-col').should('have.length', 1).contains('titi').should('not.exist')
    })
  
  })