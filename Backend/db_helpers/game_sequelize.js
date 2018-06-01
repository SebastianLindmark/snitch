/**
 * The module for handling game database-queries
 */

models = require('./models')


module.exports = {
    /**
     * Loads all the games along with their resepective current viewers
     * @returns {All games along with their respective viewer count} any[]
     */
    get_games_with_viewer_count(){
    
        return models.sequelize.query('SELECT Games.*, SUM(StreamConfigs.viewers) AS viewers FROM Games LEFT JOIN StreamConfigs ON StreamConfigs.game = Games.id GROUP BY Games.id' , { type: models.sequelize.QueryTypes.SELECT}).then(projects => {
            return projects
        })
    }
    
}