/**
 * Service to get data from TopCoder API
 */
const request = require('superagent');
const config = require('./config');
const _ = require('lodash');

/**
 * Get project details
 *
 * @param  {String} projectId project id
 *
 * @return {Promise}          promise resolved to project details
 */
const getProject = (projectId) => request
  .get(`${config.TC_API_V4_BASE_URL}/projects/${projectId}`)
  .set('accept', 'application/json')
  .set('authorization', `Bearer ${config.TC_ADMIN_TOKEN}`)
  .then((res) => {
    console.log(res);
    if (!_.get(res, 'body.result.success')) {
      throw new Error(`Failed to get project details of projectq id: ${projectId}`);
    }

    const project = _.get(res, 'body.result.content');

    return project;
  }).catch((err) => {
    console.log(err);
    const errorDetails = _.get(err, 'response.body.result.content.message');
    throw new Error(
      `Failed to get project details of project id: ${projectId}.` +
      (errorDetails ? ' Server response: ' + errorDetails : '')
    );
  });

/**
 * Get role members
 *
 * @param  {String} roleId role id
 *
 * @return {Promise}       promise resolved to role members ids list
 */
const getRoleMembers = (roleId) => request
  .get(`${config.TC_API_V3_BASE_URL}/roles/${roleId}?fields=subjects`)
  .set('accept', 'application/json')
  .set('authorization', `Bearer ${config.TC_ADMIN_TOKEN}`)
  .then((res) => {
    if (!_.get(res, 'body.result.success')) {
      throw new Error(`Failed to get role memebrs of role id: ${roleId}`);
    }

    const members = _.get(res, 'body.result.content.subjects');

    return members;
  }).catch((err) => {
    const errorDetails = _.get(err, 'response.body.result.content.message');
    throw new Error(
      `Failed to get role memebrs of role id: ${roleId}.` +
      (errorDetails ? ' Server response: ' + errorDetails : '')
    );
  });

const getUsersById = (ids) => {
  let query = _.map(ids,(id)=>{return "userId:"+id}).join(' OR ');
  return request
    .get(`${config.TC_API_V3_BASE_URL}/members/_search?fields=userId,handle,firstName,lastName&query=${query}`)
    .set('accept', 'application/json')
    .set('authorization', `Bearer ${config.TC_ADMIN_TOKEN}`)
    .then((res) => {
      if (!_.get(res, 'body.result.success')) {
        throw new Error(`Failed to get users by id: ${ids}`);
      }

      const users = _.get(res, 'body.result.content');

      return users;
    }).catch((err) => {
      const errorDetails = _.get(err, 'response.body.result.content.message');
      throw new Error(
        `Failed to get users by ids: ${ids}.` +
        (errorDetails ? ' Server response: ' + errorDetails : '')
      );
    });
  }

module.exports = {
  getProject,
  getRoleMembers,
  getUsersById,
};