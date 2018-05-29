models = require('./models')


module.exports = {
    get_games_with_viewer_count(){
    
        return models.sequelize.query('SELECT Games.*, SUM(StreamConfigs.viewers) AS viewers FROM Games LEFT JOIN StreamConfigs ON StreamConfigs.game = Games.id GROUP BY Games.id' , { type: models.sequelize.QueryTypes.SELECT}).then(projects => {
            return projects
        })
    }
    
}