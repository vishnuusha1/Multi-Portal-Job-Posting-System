const Responder = require("@shared/responder");
const logger = require("@logger");
const portalService = require("../services/portal.service");
const buildQueryOptions = require("@shared/buildQueryParams");
const { Op } = require("sequelize");


/**
 * @api {post} /portals Create a new portal
 * @apiName createPortal
 * @apiGroup Portal
 * @apiPermission admin
 *
 * @apiParam {String} name Name of the portal
 * @apiParam {String} description Description of the portal
 * @apiParam {File} logo Logo of the portal (png, jpeg, etc.)
 *
 * @apiSuccess {Object} Portal Created portal object
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError {Object} 500 Something went wrong when creating the portal
 */
const createPortal = async (req, res) => {
  const responder = new Responder(req, res);
  try {
    const { name, description } = req.body;
    const newPortal = await portalService.create({ name, description,logo: req.file.path });
    return responder.success(newPortal);
  } catch (error) {
    logger.log(error.message);
    return responder.error();
  }
};

/**
 * @api {put} /portals/:id Update a portal by ID
 * @apiName updatePortal
 * @apiGroup Portal
 * @apiPermission admin
 *
 * @apiParam {String} id Portal ID
 * @apiParam {String} name Name of the portal 
 * @apiParam {String} description Description of the portal 
 * @apiParam {File} logo Logo of the portal (png, jpeg, etc.) 
 * @apiParam {String} status Status of the portal 
 *
 * @apiSuccess {Object} Portal Updated portal object
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError {Object} 404 Portal not found
 * @apiError {Object} 500 Something went wrong when updating the portal
 */
const updatePortal = async (req, res) => {
  const responder = new Responder(req, res);
  try {
    const { id } = req.params;
    const { name, description, logo,status } = req.body;
    const [updatedRows, [updatedPortal]] = await portalService.update(
      { name, description,logo,status },
      { portalId: id }
    );

    if (updatedRows === 0) {
      return res.status(404).json({ message: "Portal not found" });
    }
    return responder.success(updatedPortal);
  } catch (error) {
    logger.log(error.message);
    return responder.error();
  }
};

/**
 * @api {delete} /portals/:id Delete a portal by ID
 * @apiName deletePortal
 * @apiGroup Portal
 * @apiPermission admin
 *
 * @apiParam {String} id Portal ID
 *
 * @apiSuccess {Object} 204
 * @apiError {Object} 404 Portal not found
 * @apiError {Object} 500 Something went wrong when deleting the portal
 */
const deletePortal = async (req, res) => {
  const responder = new Responder(req, res);
  try {
    const { id } = req.params;
    const deletedRows = await portalService.delete({ portalId:id });

    if (deletedRows === 0) {
     return responder.error("Portal not found", null, 404);
    }
   return responder.success();
  } catch (error) {
    logger.log(error.message);
    return responder.error();
  }
};

/**
 * @api {get} /portals Get all portals with optional filters and pagination
 * @apiName getAllPortals
 * @apiGroup Portal
 * @apiParam {String} [search] Search term to filter portal name
 * @apiUse pagination
 *
 * @apiSuccess {Object} Portals List of portals with applied filters
 * @apiError {Object} 500 Something went wrong when getting the portals
 */
const getAllPortals = async (req, res) => {
  const responder = new Responder(req, res);
  try {
    const { search, ...queryOptions } = buildQueryOptions(req.query);
    const portals = await portalService.findAndCount({
      where: {
        [Op.or]: {
          name: { [Op.like]: `%${search}%` },
        },
      },...queryOptions
    });
    return responder.success(portals);
  } catch (error) {
    logger.error(error.message);
    return responder.error();
  }
};


/**
 * @api {get} /portal-usage-summary Get portal usage summary data
 * @apiName getPortalUsageSummary
 * @apiGroup Portal
 * @apiSuccess {Object} Portal usage summary data
 * @apiSuccessProperty {Integer} activePortals Number of active portals
 * @apiSuccessProperty {Integer} inactivePortals Number of inactive portals
 * @apiSuccessProperty {Integer} suspendedPortals Number of suspended portals
 * @apiSuccessProperty {Array} portalsWithUsage List of portals with usage data
 * @apiSuccessProperty {Object} portalsWithUsage.portal Portal with usage data
 * @apiSuccessProperty {String} portalsWithUsage.portal.portalId Unique identifier for the portal
 * @apiSuccessProperty {String} portalsWithUsage.portal.name Name of the portal
 * @apiSuccessProperty {Integer} portalsWithUsage.portal.jobsPosted Number of jobs posted on the portal
 * @apiSuccessProperty {Integer} portalsWithUsage.portal.documentsUploaded Number of documents uploaded to the portal
 *
 * @apiError {Object} 500 Something went wrong when getting the portal usage summary
 */
const getPortalUsageSummary = async (req, res) => {
  const responder = new Responder(req, res);
  try {
    const [activePortals, inactivePortals, suspendedPortals,portalsWithUsage] = await Promise.all([
      await portalService.count({ where: { status: 'active' } }),
      await portalService.count({ where: { status: 'inactive' } }),
      await portalService.count({ where: { status: 'suspended' } }),
      await portalService.portalsWithUsage()
    ]);
    
    const portals = {
      activePortals,
      inactivePortals,
      suspendedPortals,
      portalsWithUsage,
    };

   return responder.success(portals);
  } catch (error) {
    logger.error(error.message);
    responder.error();
  }
};


module.exports = {
  createPortal,
  updatePortal,
  deletePortal,
  getAllPortals,
  getPortalUsageSummary
};
