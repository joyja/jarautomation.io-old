---
title: Synchronizing Ignition Edge
description: "Using GitLab CD to Unify the Ignition Edge Panel Experience"
created: March 17, 2021
---

Here is one way to keep your Ignition Edge Panel screens synced with a centralized gateway:

## Source Control

First, let's talk about source control. Before Ignition 8, Ignition kept track of modifications and allowed you to roll back to old versions internally. Once Ignition 8 was released, Inductive Automation abandoned this feature in favor of making all resources plain text based so git could be used for source control. This provides the same functionality as Ignition 7 version tracking plus a whole lot more. It may not feel as intuitive for people without experience in software development, but it was a great move on Inductive Automation's part to give Ignition all the power behind the Git ecosystem. 

In short, if you have an Ignition 8 server in production you should definitely consider using a Git server for source control regardless of whether you are trying to synchronize an Ignition Edge Panel Edition application with a central Ignition gateway or not. Inductive Automation released a great article, [Ignition 8 Deployment Best Practices](https://www.inductiveautomation.com/resources/article/ignition-8-deployment-best-practices) that includes a detailed example of using Git with Ignition. The example in the article uses GitLab, which is a great choice, because you get free private repositories and they provide the continuous delivery tools we'll use in this post to automate synchronization of resource between the central Ignition gateway and Ignition Edge panel edition.

## The Big Picture

So, what is it that we are trying to do? Here's the problem: 

Ignition Edge Panel Edition maintains it's own local resources in order to provide a fully functional local HMI even without a connection to the central Ignition gateway that operators would normally use. From [this forum post](https://forum.inductiveautomation.com/t/edge-configuration/26012/3), the traditional way to address this was to provide a minimal HMI in the event of a failure or use EAM to send resources to the Edge. This post describes another option: synchronize resources with Ignition Edge when they are committed to the Central Ignition Gateway repository. This avoids the reliance on EAM (which is an added cost) and maintains the user experience whether the operator is looking at the central gateway or the edge application.

It looks like this:

<jar-image aspect-ratio="2" basis="800px" color="transparent" src="https://res.cloudinary.com/jarautomation/image/upload/f_auto/v1615827980/blog/2021-03-15%20Ignition%20Edge%20Synchronization/Ignition_Edge_Synchronization.png" lazy-src="https://res.cloudinary.com/jarautomation/image/upload/e_blur:1000,q_1,f_auto/v1615827980/blog/2021-03-15%20Ignition%20Edge%20Synchronization/Ignition_Edge_Synchronization.png" alt="Ignition Source Control Architecture"></jar-image>

We set up the central gateway to automatically commit and push to the GitLab Central Ignition Gateway repository. Upon commit, GitLab runners will run jobs for the edge gateways to update their resources from the central gateway repository. I also recommend that each edge has their own individual repositories for version control.

## The Central Gateway

At the central gateway we're going to initialize a git repository in the project directory, set it up to use GitLab as a remote, and configure Ignition to automatically commit and push on every save.

### Create the remote repository

Let's set up a remote repository on GitLab for our central Ignition gateway to push to. Go to [GitLab](https://gitlab.com), log in and click Create Repository:

<jar-image aspect-ratio="2" basis="1162px" color="transparent" src="https://res.cloudinary.com/jarautomation/image/upload/f_auto/v1615832757/blog/2021-03-15%20Ignition%20Edge%20Synchronization/GitLab%20New%20Project.png" lazy-src="https://res.cloudinary.com/jarautomation/image/upload/e_blur:1000,q_1,f_auto/v1615832757/blog/2021-03-15%20Ignition%20Edge%20Synchronization/GitLab%20Create%20Blank%20Project.png" alt="GitLab New Project"></jar-image>

<jar-image aspect-ratio="2" basis="1162px" color="transparent" src="https://res.cloudinary.com/jarautomation/image/upload/f_auto/v1615832757/blog/2021-03-15%20Ignition%20Edge%20Synchronization/GitLab%20Create%20Blank%20Project.png" lazy-src="https://res.cloudinary.com/jarautomation/image/upload/e_blur:1000,q_1,f_auto/v1615832757/blog/2021-03-15%20Ignition%20Edge%20Synchronization/GitLab%20Create%20Blank%20Project.png" alt="GitLab Create Blank Project"></jar-image>

<jar-image aspect-ratio="2" basis="1162px" color="transparent" src="https://res.cloudinary.com/jarautomation/image/upload/f_auto/v1615832757/blog/2021-03-15%20Ignition%20Edge%20Synchronization/GitLab%20New%20Project%20Form.png" lazy-src="https://res.cloudinary.com/jarautomation/image/upload/e_blur:1000,q_1,f_auto/v1615832757/blog/2021-03-15%20Ignition%20Edge%20Synchronization/GitLab%20New%20Project%20Form.png" alt="GitLab Project Form"></jar-image>

## SSH Authentication

We'll also need SSH keys for git to authenticate against Git lab. Be sure to be logged into the user account ignition will run with. On Ubuntu (and on the latest version of Windows Server) you can use `ssh-keygen` from the terminal, which will create a key called `id_rsa` in the `.ssh` folder of your user directory. Find the `$USER/.ssh/id_rsa.pub` file and copy the contents up to GitLab using the form shown below. This is you telling GitLab to allow your ignition server, identified by its ssh key, to commit repositories in your account.


```shell
ignition-user@ignition1:~$ ssh-keygen
Generating public/private rsa key pair.
Enter file in which to save the key (/home/ubuntu/.ssh/id_rsa): 
Enter passphrase (empty for no passphrase): 
Enter same passphrase again: 
Your identification has been saved in /home/ubuntu/.ssh/id_rsa.
Your public key has been saved in /home/ubuntu/.ssh/id_rsa.pub.
The key fingerprint is:
SHA256:TUmV7O9KhF7/zRFAoS1esCEAZTERLiUQ8IMXKiMwqgk ubuntu@test
The keys randomart image is:
+---[RSA 2048]----+
|o..+oooX=..=.+.  |
|o.+ . = ....X    |
|Eo + . .  o= +   |
|=o. . .  o..+ .  |
|o       S o.o. . |
|         . o .. .|
|          . .... |
|           .  .oo|
|            ..  +|
+----[SHA256]-----+
ignition-user@ignition1:~$ cat ~/.ssh/id_rsa.pub 
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDaPxdnfDigTUJyLnH8Ya9j1qhqJXNbJqynq7m+iGuU857+zIm3Kz/WjSApaGal9vFgZBHd/
+9wbzGuLakRvGRMHfjGpAWQPdnwg7NgmjC2+vvr835tXYNOk9W8rtT9ePAv9FqoJ0SrDGWXTFBE+SyR8ljTNzcxiwlBEP4Y
+cL0NkS7PFkaIP6Se7A4wyi6mGQNBmjeyBU8oBNeXZ7tIk1FbPh/Hntk8eL8Ad6mFROkPzs+FiRJQ8mLIYzUUD0/x6FZ+n0TOsd05JXOrz7dzWu/
GoMRjsPtS18HiPVUg6RQhmdjmDYdrnV+YJwEsSt3KFWpsSLgvYCAI9wV+WiOWU+R ignition-user@ignition1
## ↑ The result of this cat command is what you'll past into the GitLab form below
```
<br />
<jar-image aspect-ratio="2" basis="1162px" color="transparent" src="https://res.cloudinary.com/jarautomation/image/upload/f_auto/v1615835791/blog/2021-03-15%20Ignition%20Edge%20Synchronization/GitLab%20SSH%20Keys.png" lazy-src="https://res.cloudinary.com/jarautomation/image/upload/e_blur:1000,q_1,f_auto/v1615835791/blog/2021-03-15%20Ignition%20Edge%20Synchronization/GitLab%20SSH%20Keys.png"></jar-image>
<br />

### Create the local repository

We'll be using Ubuntu so our project directory will be `/usr/local/bin/ignition/data/projects`. On Windows it will likely be `C:\Program Files\Inductive Automation\Ignition\data\projects`. We'll be doing the following wherever your Ignition project directory is located.

```shell
## Configure git if you haven't already
git config --global user.name "James A. Joy" #Use whatever name you'd like to use for git
git config --global user.email "joyja@jarautomation.io" #Use whatever email you'd like to use for git

cd /usr/local/bin/ignition/data/projects #or wherever your project directory is located

## Use a .gitignore file so you don't commit the .resources/ folder of your projects directory
touch .gitignore
echo ".resources/" >> .gitignore 

## Set up the local repo
git init
git remote add origin git@gitlab.com:joyja/central-ignition.git #use the address for your remote repo
git add .
git commit -m "Initial commit"
git push -u origin master
```

### Commit On Save

Now we'll setup Ignition to git commit and push to the remote repository whenever we save. Make a file in Ignition's data folder, `/usr/local/bin/ignition/data/git-auto-commit.sh` on Ubuntu. The contents of this file will be:

```shell
cd /var/lib/ignition/data/projects ## or wherever your project directory is
NOW=$(date +"%m-%d-%Y %H:%M:%S")
git add .
git commit -m "Designer save @ $NOW"
git push origin
```

Then open up an ignition designer and edit the Gateway Event scripts to export tags and run the git-auto-commit.sh script on update:

<jar-image aspect-ratio="2" basis="1162px" color="transparent" src="https://res.cloudinary.com/jarautomation/image/upload/f_auto/v1615958298/blog/2021-03-15%20Ignition%20Edge%20Synchronization/Ignition%20Gateway%20Update%20Commit%20On%20Save.png" lazy-src="https://res.cloudinary.com/jarautomation/image/upload/e_blur:1000,q_1,f_auto/v1615958298/blog/2021-03-15%20Ignition%20Edge%20Synchronization/Ignition%20Gateway%20Update%20Commit%20On%20Save.png"></jar-image>
<br />

```python
import time
tagExportPath = "/usr/local/bin/ignition/data/projects/tags.json"
system.tag.exportTags(filePath=tagExportPath, tagPaths=["[default]"])
time.sleep(5)
system.util.execute(["/usr/local/bin/ignition/data/git-auto-commit.sh"])
```

## The Edge

Now we're going to setup the Edge to copy screens for the site from the central gateway repository to the Ignition edge project every time a commit is made.

### Install the GitLab Runner

The GitLab runner monitors a repository and runs jobs whenever a commit is made. The [GitLab Docs](https://docs.gitlab.com/runner/install/) describe installation for various environments in detail, but on our Ignition Edge ubuntu environment we'll run:

```
curl -L "https://packages.gitlab.com/install/repositories/runner/gitlab-runner/script.deb.sh" | sudo bash
export GITLAB_RUNNER_DISABLE_SKEL=true; sudo -E apt-get install gitlab-runner
```

Then we'll register the runner with our central-ignition GitLab repository, using the token from `Settings>CI/CD`:

<jar-image aspect-ratio="2" basis="1162px" color="transparent" src="https://res.cloudinary.com/jarautomation/image/upload/f_auto/v1615962383/blog/2021-03-15%20Ignition%20Edge%20Synchronization/GitLab%20Runner%20Settings.png" lazy-src="https://res.cloudinary.com/jarautomation/image/upload/e_blur:1000,q_1,f_auto/v1615962383/blog/2021-03-15%20Ignition%20Edge%20Synchronization/GitLab%20Runner%20Settings.png"></jar-image>
<br />

1. Run the following command in the Ignition Edge environment:
```
sudo gitlab-runner register
```
2. Enter your GitLab instance URL (i.e. https://gitlab.com)
3. Enter the token for your repository (from the `Settings>CI/CD` screen) to register the runner.
4. Enter a description for the runner. You can change this value later in the GitLab user interface.
5. Enter tags associated with the runner. We'll use this to assign the runner to run jobs for a specific site. For example, Site 1 will have a site1 tag.
6. Select `shell` for the runner executor.

<br />

Now in your repositories CI/CD settins you should see your runner:

<jar-image aspect-ratio="2" basis="1162px" color="transparent" src="https://res.cloudinary.com/jarautomation/image/upload/f_auto/v1615994606/blog/2021-03-15%20Ignition%20Edge%20Synchronization/GitLab%20Runner.png" lazy-src="https://res.cloudinary.com/jarautomation/image/upload/e_blur:1000,q_1,f_auto/v1615994606/blog/2021-03-15%20Ignition%20Edge%20Synchronization/GitLab%20Runner.png"></jar-image>
<br />

### Create jobs

Now we're ready to create the job that deploy our site 1 screens whenever we commit to the central Ignition repository, which happens when we save our central Ignition project from the designer. We do this by creating a `.gitlab-ci.yaml` file in the repo.

In `/usr/local/bin/ignition/data/projects` (or wherever your project directory is located) we'll make `.gitlab-ci.yaml` with the following contents:

```yaml
stages:
- deploy

deployToSite1:
  only:
  - master
  stage: deploy
  tags:
    - site1
  script:
    - echo "the project directory is - $CI_PROJECT_DIR"
    - sudo cp -r "$CI_PROJECT_DIR/central/com.inductiveautomation.perspective/views/Site 1" /usr/local/bin/ignition/data/projects/Edge/com.inductiveautomation.perspective/views/
  #Where central (in $CI_PROCJECT/central...) is the name of our central ignition project
```

After creating the file, we'll commit and push:

```shell
git add .
git commit -am 'Created .gitlab-ci.yaml'
git push
```

GitLab will immediately recognize the file and run the job on the gitlab runner. From this point on, every time you save the screens in the central Ignition project will be copied to the Edge. You can monitor the status of every job on Gitlab and see the command line output, making troubleshooting simple:

<jar-image aspect-ratio="2" basis="1162px" color="transparent" src="https://res.cloudinary.com/jarautomation/image/upload/f_auto/v1615996846/blog/2021-03-15%20Ignition%20Edge%20Synchronization/gitlab_pipeline_status.png" lazy-src="https://res.cloudinary.com/jarautomation/image/upload/e_blur:1000,q_1,f_auto/v1615996846/blog/2021-03-15%20Ignition%20Edge%20Synchronization/gitlab_pipeline_status.png"></jar-image>
<br />
<jar-image aspect-ratio="2" basis="1162px" color="transparent" src="https://res.cloudinary.com/jarautomation/image/upload/f_auto/v1615996768/blog/2021-03-15%20Ignition%20Edge%20Synchronization/gitlab_job_status.png" lazy-src="https://res.cloudinary.com/jarautomation/image/upload/e_blur:1000,q_1,f_auto/v1615996768/blog/2021-03-15%20Ignition%20Edge%20Synchronization/gitlab_job_status.png"></jar-image>
<br />

## Final Thoughts

That's it! After all that we have a system that synchronizes Ignition Edge with the centralized gateway. We can do this with other Ignition resources too, including styles and vision templates. Some may be wondering, "why not use EAM instead?" and the answer is, you can! It's completely up to you how you synchronize resources. I prefer this over EAM because I think source control is 100% necessary on every Ignition project, so I'll have it anyway, plus there is no additional licensing costs to use Gitlab for this as there would be with EAM (if this was the only thing you were using EAM for).